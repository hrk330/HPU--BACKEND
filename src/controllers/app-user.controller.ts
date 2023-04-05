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
import {AppUsers} from '../models';
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
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    console.log(0);
    let token = '';
    try {
      const user = await this.userService.verifyCredentials(credentials);
      console.log(user);
      console.log(1);
      //this.appUsersRepository.updateById(id, appUsers)
      // convert a User object into a UserProfile object (reduced set of properties)
      const userProfile = this.userService.convertToUserProfile(user);
      console.log(userProfile);
      console.log(2);

      // create a JSON Web Token based on the user profile
      token = await this.jwtService.generateToken(userProfile);
    } catch (e) {
      console.log(e);
    }
    return {token};
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
    const filter = {where: {email: newUserRequest.email}};
    const user = await this.appUsersRepository.findOne(filter);
    let result = "SUCCESS";
    if (user) {
      result = "FAILURE";
      return result;
    }
    const password = await hash(newUserRequest.password, await genSalt());
    const savedUser = await this.userRepository.create(
      _.omit(newUserRequest, 'password'),
    );

    await this.userRepository.userCredentials(savedUser.id).create({password});

    return result;
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
    console.log(newUserRequest);
    const password = await hash(newUserRequest.password, await genSalt());
    const filter = {where: {email: newUserRequest.email}};
    const user = await this.appUsersRepository.findOne(filter);
    if (user) {
      await this.userRepository.userCredentials(user.id).delete();
      await this.userRepository.userCredentials(user.id).create({password});
    }

    return "savedUser";
  }

  @post('/appUsers/sendEmailCode/{email}', {
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
          schema: String,
        },
      },
    })
    @param.path.string('email') email: string,
  ): Promise<String> {
    console.log((await this.addMinutes(new Date(), 15)).toDateString());
    this.verificationCodesRepository.create({key: email, code: await this.getRandomInt(999999), type: 'E', status: 'L', expiry: (await this.addMinutes(new Date(), 15)).toDateString()});
    return "SUCCESS";
  }
  async getRandomInt(max: number): Promise<string> {
    return Math.floor(Math.random() * max).toString();
  }

  async addMinutes(date: Date, minutes: number): Promise<Date> {
    console.log(date);
    date.setMinutes(date.getMinutes() + minutes);
    console.log(date.getMinutes());
    console.log(minutes);
    console.log(date);

    return date;
  }

  @post('/appUsers/sendSmsCode', {
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
  async sendSmsCode(
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
    console.log(newUserRequest);
    const password = await hash(newUserRequest.password, await genSalt());
    const filter = {where: {email: newUserRequest.email}};
    const user = await this.appUsersRepository.findOne(filter);
    if (user) {
      await this.userRepository.userCredentials(user.id).delete();
      await this.userRepository.userCredentials(user.id).create({password});
    }

    return "savedUser";
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
    @param.filter(User) filter?: Filter<User>,
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
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
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
