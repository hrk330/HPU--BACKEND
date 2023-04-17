import {authenticate, TokenService} from '@loopback/authentication';
import {
  Credentials,
  MyUserService,
  TokenServiceBindings,
  User,
  UserRepository,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
  SchemaObject,
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {AppUsers, VerificationRequestObject} from '../models';
import {AppUsersRepository, VerificationCodesRepository} from '../repositories';

const CredentialsSchema: SchemaObject = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minLength: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {schema: CredentialsSchema},
  },
};

export class AppUserController {
  constructor(
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(UserRepository)
    protected userRepository: UserRepository,
    @repository(VerificationCodesRepository)
    protected verificationCodesRepository: VerificationCodesRepository,
  ) { }

  @authenticate('jwt')
  @get('/whoAmI', {
    responses: {
      '200': {
        description: 'Return current user',
        content: {
          'application/json': {
            schema: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<string> {
    console.log(currentUserProfile);
    return currentUserProfile[securityId];
  }

  @post('/appUsers/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: Credentials,
  ): Promise<String> {
    // ensure the user exists, and the password is correct
    let result = {code: 5, msg: "Invalid email or password.", token: '', user: {}};
    try {
      const filter = {where: {email: credentials.email}, include: [{'relation': 'userCreds'}]};
      const user = await this.appUsersRepository.findOne(filter);

      //const user = await this.userService.verifyCredentials(credentials);
      if (user && user.userCreds) {
        const salt = user.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === user.userCreds.password) {

          //this.appUsersRepository.updateById(id, appUsers)
          // convert a User object into a UserProfile object (reduced set of properties)

          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
          result.user = user;
          result.code = 0;
          result.msg = "User logged in successfully.";
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/appUsers/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {

    let result = {code: 5, msg: "User registeration failed.", token: '', userId: ''};
    try {
      const filter = {where: {email: newUserRequest.email}};
      const user = await this.appUsersRepository.findOne(filter);

      if (user && user.id) {
        result = {code: 5, msg: "User already exists", token: '', userId: ''};
      } else {
        const salt = await genSalt();
        const password = await hash(newUserRequest.password, salt);
        newUserRequest.roleId = "APPUSER";
        const savedUser = await this.appUsersRepository.create(
          _.omit(newUserRequest, 'password'),
        );
        if (savedUser) {
          await this.appUsersRepository.userCreds(savedUser.id).create({password, salt});
          const userProfile = this.userService.convertToUserProfile(savedUser);

          result.userId = savedUser.id;
          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(userProfile);
          result.code = 0;
          result.msg = "User registered successfully.";
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/appUsers/socialSignUp', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async socialSignUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    const filter = {where: {socialId: newUserRequest.socialId, socialIdType: newUserRequest.socialIdType}};
    const user = await this.appUsersRepository.findOne(filter);
    let result = {code: 0, msg: "User registered successfully.", token: '', userId: ''};
    if (user) {
      result = {code: 5, msg: "User already exists", token: '', userId: ''};
    } else {
      newUserRequest.roleId = "APPUSER";
      const savedUser = await this.appUsersRepository.create(newUserRequest);

      const userProfile = this.userService.convertToUserProfile(savedUser);

      result.userId = savedUser.id;
      // create a JSON Web Token based on the user profile
      result.token = await this.jwtService.generateToken(userProfile);
    }
    return JSON.stringify(result);
  }

  @post('/appUsers/socialLogin', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async socialLogin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    // ensure the user exists, and the password is correct
    let result = {code: 5, msg: "Invalid Login.", token: '', user: {}};
    try {
      const filter = {where: {socialId: newUserRequest.socialId, socialIdType: newUserRequest.socialIdType}};
      const user = await this.appUsersRepository.findOne(filter);
      if (user) {

        //this.appUsersRepository.updateById(id, appUsers)
        // convert a User object into a UserProfile object (reduced set of properties)

        // create a JSON Web Token based on the user profile
        result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
        result.user = user;
        result.code = 0;
        result.msg = "User logged in successfully";
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/appUsers/updateProfile', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async updateProfile(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    const filter = {where: {id: newUserRequest.id}};
    await this.appUsersRepository.updateById(newUserRequest.id, _.omit(newUserRequest, 'email'));
    const user = await this.appUsersRepository.findOne(filter);
    let result = {code: 0, msg: "User profile updated successfully.", user: user};
    return JSON.stringify(result);
  }

  @post('/appUsers/resetPassword', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: {
              'x-ts-type': User,
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewUser', partial: true
          }),
        },
      },
    })
    newUserRequest: AppUsers
  ): Promise<String> {
    let result = {code: 5, msg: "Reset password failed."};

    const filter = {where: {email: newUserRequest.email}};
    const user = await this.appUsersRepository.findOne(filter);
    if (user) {
      const salt = await genSalt();
      const password = await hash(newUserRequest.password, salt);
      const updatedAt = new Date();
      await this.appUsersRepository.userCreds(user.id).patch({password, salt, updatedAt});
      result.code = 0;
      result.msg = "Password has been reset successfully.";
    }

    return JSON.stringify(result);
  }

  @post('/appUsers/verifyCode', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async verifyCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject', partial: true
          }),
        },
      },
    })
    verificationRequestObject: VerificationRequestObject
  ): Promise<String> {
    let result = {code: 5, msg: "Verification code was not verified."};
    const verificationCodefilter = {where: {key: verificationRequestObject.email, code: verificationRequestObject.verificationCode, status: 'L'}, order: ['createdAt desc']};
    const verificationCodeObject = await this.verificationCodesRepository.findOne(verificationCodefilter);
    if (verificationCodeObject) {
      const currentDateTime = new Date();
      if (verificationCodeObject.expiry && currentDateTime < verificationCodeObject.expiry) {
        await this.verificationCodesRepository.updateById(verificationCodeObject.id, {status: 'V'});
        result.code = 0;
        result.msg = "Verification code has been verified.";
      }
    }

    return JSON.stringify(result);
  }

  @post('/appUsers/sendEmailCode', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async sendEmailCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(VerificationRequestObject, {
            title: 'VerificationRequestObject', partial: true
          }),
        },
      },
    }) verificationRequestObject: VerificationRequestObject,
  ): Promise<String> {
    let result = {code: 5, msg: "Verification code not sent."};
    const filter = {where: {email: verificationRequestObject.email}};

    const user = await this.appUsersRepository.findOne(filter);

    if (verificationRequestObject.type === 'RP') {
      if (!user || !user.id) {
        result.code = 5;
        result.msg = "User does not exits.";
      } else {
        try {
          this.verificationCodesRepository.create({key: verificationRequestObject.email, code: await this.getRandomInt(999999), type: 'E', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
          result.code = 0;
          result.msg = "Verification code sent successfully.";
        } catch (e) {
          result.code = 5;
          result.msg = e.message;
        }
      }
    } else if (verificationRequestObject.type === 'SU') {
      if (user && user.id) {
        result.code = 5;
        result.msg = "User already exits.";
      } else {
        try {
          this.verificationCodesRepository.create({key: verificationRequestObject.email, code: await this.getRandomInt(999999), type: 'E', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
          result.code = 0;
          result.msg = "Verification code sent successfully.";
        } catch (e) {
          result.code = 5;
          result.msg = e.message;
        }
      }
    }


    return JSON.stringify(result);
  }
  async getRandomInt(max: number): Promise<string> {
    //return Math.floor(Math.random() * max).toString();
    return "1234";
  }

  async addMinutes(date: Date, minutes: number): Promise<Date> {
    date.setMinutes(date.getMinutes() + minutes);
    return date;
  }

  @authenticate('jwt')
  @post('/appUsers/sendSmsCode/{mobileNumber}', {
    responses: {
      '200': {
        description: 'User',
        content: {
          'application/json': {
            schema: String,
          },
        },
      },
    },
  })
  async sendSmsCode(
    @requestBody({
      content: {
        'application/json': {
          schema: String,
        },
      },
    })
    @param.path.string('mobileNumber') mobileNumber: string,
  ): Promise<String> {
    this.verificationCodesRepository.create({key: mobileNumber, code: await this.getRandomInt(999999), type: 'M', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toString()});
    return "SUCCESS";
  }

  @get('/appUsers/count')
  @response(200, {
    description: 'AppUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AppUsers) where?: Where<AppUsers>,
  ): Promise<Count> {
    return this.appUsersRepository.count(where);
  }

  @get('/appUsers')
  @response(200, {
    description: 'Array of AppUsers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AppUsers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AppUsers) filter?: Filter<AppUsers>,
  ): Promise<User[]> {
    return this.appUsersRepository.find(filter);
  }

  @patch('/appUsers')
  @response(200, {
    description: 'AppUsers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {partial: true}),
        },
      },
    })
    appUsers: AppUsers,
    @param.where(AppUsers) where?: Where<AppUsers>,
  ): Promise<Count> {
    console.log(where);
    return this.appUsersRepository.updateAll(appUsers, where);
  }

  @get('/appUsers/{id}')
  @response(200, {
    description: 'AppUsers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AppUsers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(AppUsers, {exclude: 'where'}) filter?: FilterExcludingWhere<AppUsers>
  ): Promise<User> {
    return this.appUsersRepository.findById(id, filter);
  }

  @patch('/appUsers/{id}')
  @response(204, {
    description: 'AppUsers PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {partial: true}),
        },
      },
    })
    appUsers: AppUsers,
  ): Promise<void> {
    await this.appUsersRepository.updateById(id, appUsers);
  }

  @put('/appUsers/{id}')
  @response(204, {
    description: 'AppUsers PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() appUsers: AppUsers,
  ): Promise<void> {
    await this.appUsersRepository.replaceById(id, appUsers);
  }

  @del('/appUsers/{id}')
  @response(204, {
    description: 'AppUsers DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.appUsersRepository.deleteById(id);
  }
}
