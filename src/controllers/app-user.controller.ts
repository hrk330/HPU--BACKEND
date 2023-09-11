import {authenticate, TokenService} from '@loopback/authentication';
import {
  MyUserService,
  TokenServiceBindings,
  User,
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
} from '@loopback/rest';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {
  AppUsers,
  CredentialsRequest,
  CredentialsRequestBody,
  ServiceOrders,
  UserCreds,
} from '../models';
import {
  AppUsersRepository,
  ServiceOrdersRepository,
  VerificationCodesRepository,
} from '../repositories';
import {AccCreateEmails} from '../utils';

export class AppUserController {
  private AccCreateEmails: AccCreateEmails = new AccCreateEmails();
  constructor(
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(VerificationCodesRepository)
    protected verificationCodesRepository: VerificationCodesRepository,
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
  ) {}

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
    @requestBody(CredentialsRequestBody) credentials: CredentialsRequest,
  ): Promise<String> {
    // ensure the user exists, and the password is correct
    const result = {
      code: 5,
      msg: 'Invalid email or password.',
      token: '',
      user: {},
    };
    try {
      const user = await this.appUsersRepository.findOne({
        where: {email: credentials.email, roleId: 'APPUSER'},
        include: [{relation: 'userCreds'}],
      });

      //const user = await this.userService.verifyCredentials(credentials);
      if(user?.userStatus !== "S") {
        if (user?.userCreds) {
          const salt = user.userCreds.salt;
          const password = await hash(credentials.password, salt);
          if (password === user.userCreds.password) {
            //this.appUsersRepository.updateById(id, appUsers)
            // convert a User object into a UserProfile object (reduced set of properties)

            // create a JSON Web Token based on the user profile
            result.token = await this.jwtService.generateToken(
              this.userService.convertToUserProfile(user),
            );
            user.userCreds = new UserCreds();
            result.user = user;
            result.code = 0;
            result.msg = 'User logged in successfully.';
          }
        }
      } else {
        result.msg = 'User suspended.';
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
    let result = {
      code: 5,
      msg: 'User registeration failed.',
      token: '',
      userId: '',
    };
    try {
      const filter = {where: {email: newUserRequest.email, roleId: 'APPUSER'}};
      const user = await this.appUsersRepository.findOne(filter);

      if (user?.id) {
        result = {code: 5, msg: 'User already exists', token: '', userId: ''};
      } else {
        const salt = await genSalt();
        const password = await hash(newUserRequest.password, salt);
        newUserRequest.roleId = 'APPUSER';
        const savedUser = await this.appUsersRepository.create(
          _.omit(newUserRequest, 'password'),
        );
        if (savedUser) {
          await this.appUsersRepository
            .userCreds(savedUser.id)
            .create({password, salt});
          await this.appUsersRepository
            .account(savedUser.id)
            .create({balanceAmount: 0});
          const userProfile = this.userService.convertToUserProfile(savedUser);

          result.userId = savedUser.id;
          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(userProfile);
          result.code = 0;
          result.msg = 'User registered successfully.';
          await this.AccCreateEmails.sendUserAccCreateByAppVerificationEmail(
            savedUser,
          );
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
    const filter = {
      where: {
        socialId: newUserRequest.socialId,
        socialIdType: newUserRequest.socialIdType,
        roleId: 'APPUSER',
      },
    };
    const user = await this.appUsersRepository.findOne(filter);
    let result = {
      code: 0,
      msg: 'User registered successfully.',
      token: '',
      userId: '',
    };
    if (user) {
      result = {code: 5, msg: 'User already exists', token: '', userId: ''};
    } else {
      newUserRequest.roleId = 'APPUSER';
      const savedUser = await this.appUsersRepository.create(newUserRequest);
      if (savedUser) {
        await this.appUsersRepository
          .account(savedUser.id)
          .create({balanceAmount: 0});
      }

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
    const result = {code: 5, msg: 'Invalid Login.', token: '', user: {}};
    try {
      const filter = {
        where: {
          socialId: newUserRequest.socialId,
          socialIdType: newUserRequest.socialIdType,
          roleId: 'APPUSER',
        },
      };
      const user = await this.appUsersRepository.findOne(filter);
      if(user) {
        if(user?.userStatus !== "S") {
          //this.appUsersRepository.updateById(id, appUsers)
          // convert a User object into a UserProfile object (reduced set of properties)

          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(
            this.userService.convertToUserProfile(user),
          );
          result.user = user;
          result.code = 0;
          result.msg = 'User logged in successfully';
        } else {
          result.msg = "User suspended";
        }
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
    await this.appUsersRepository.updateById(
      newUserRequest.id,
      _.omit(newUserRequest, 'email'),
    );
    const user = await this.appUsersRepository.findById(newUserRequest.id, {});
    const result = {
      code: 0,
      msg: 'User profile updated successfully.',
      user: user,
    };
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/appUsers/updateEndpoint', {
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
  async updateEndpoint(
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
    await this.appUsersRepository.updateById(
      newUserRequest.id,
      _.pick(newUserRequest, 'endpoint'),
    );
    const user = await this.appUsersRepository.findById(newUserRequest.id, {});
    const result = {
      code: 0,
      msg: 'User profile updated successfully.',
      user: user,
    };
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/appUsers/logoutAppUser', {
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
  async logoutAppUser(
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
    await this.appUsersRepository.updateById(newUserRequest.id, {endpoint: ''});
    const result = {code: 0, msg: 'User logged out successfully.'};
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
            title: 'NewUser',
            partial: true,
          }),
        },
      },
    })
    newUserRequest: AppUsers,
  ): Promise<String> {
    const result = {code: 5, msg: 'Reset password failed.'};

    const filter = {where: {email: newUserRequest.email, roleId: 'APPUSER'}};
    const user = await this.appUsersRepository.findOne(filter);
    if (user) {
      const salt = await genSalt();
      const password = await hash(newUserRequest.password, salt);
      const updatedAt = new Date();
      await this.appUsersRepository
        .userCreds(user.id)
        .patch({password, salt, updatedAt});
      result.code = 0;
      result.msg = 'Password has been reset successfully.';
    }

    return JSON.stringify(result);
  }

  @post('/appUsers/changePassword', {
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
  async changePassword(
    @requestBody(CredentialsRequestBody) credentialsRequest: CredentialsRequest,
  ): Promise<String> {
    const result = {code: 5, msg: 'Change password failed.'};
    if (
      credentialsRequest?.id &&
      credentialsRequest?.password &&
      credentialsRequest?.oldPassword
    ) {
      const user = await this.appUsersRepository.findOne({
        where: {id: credentialsRequest.id, roleId: 'APPUSER'},
        include: [{relation: 'userCreds'}],
      });

      if (user?.userCreds) {
        let salt = user.userCreds.salt;
        let password = await hash(credentialsRequest.oldPassword, salt);
        if (password === user.userCreds.password) {
          salt = await genSalt();
          password = await hash(credentialsRequest.password, salt);
          const updatedAt = new Date();
          await this.appUsersRepository
            .userCreds(user.id)
            .patch({password, salt, updatedAt});
          result.code = 0;
          result.msg = 'Password has been changed successfully.';
        }
      }
    }
    return JSON.stringify(result);
  }

  @get('/appUsers/count')
  @response(200, {
    description: 'AppUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(AppUsers) where?: Where<AppUsers>): Promise<Count> {
    return this.appUsersRepository.count(where);
  }

  @get('/appUsers/getSearchedUsers/{email}')
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
  async findByEmail(
    @param.path.string('email') email: string,
  ): Promise<User[]> {
    return this.appUsersRepository.find({
      where: {roleId: 'APPUSER', email: {like: email}},
      limit: 10,
      fields: ['id', 'email'],
    });
  }

  @post('/appUsers/admin/createAppUser', {
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
  async adminCreateAppUser(
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
    let result = {
      code: 5,
      msg: 'User creation failed.',
      user: {},
    };
    try {
      const filter = {where: {email: newUserRequest.email, roleId: 'APPUSER'}};
      const user = await this.appUsersRepository.findOne(filter);

      if (user?.id) {
        result = {code: 5, msg: 'User already exists', user: {}};
      } else {
        const salt = await genSalt();
        const password = await hash(newUserRequest.password, salt);
        newUserRequest.roleId = 'APPUSER';
        const savedUser = await this.appUsersRepository.create(
          _.omit(newUserRequest, 'password'),
        );
        if (savedUser) {
          await this.appUsersRepository
            .userCreds(savedUser.id)
            .create({password, salt});
          await this.appUsersRepository
            .account(savedUser.id)
            .create({balanceAmount: 0});
          result.user = savedUser;
          // create a JSON Web Token based on the user profile
          result.code = 0;
          result.msg = 'User created successfully.';
        }
        await this.AccCreateEmails.sendUserAccCreateByAdminEmail(
          savedUser,
          newUserRequest,
        );
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/appUsers/admin/updateAppUser', {
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
  async adminUpdateAppUser(
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
    let result = {
      code: 5,
      msg: 'User update failed.',
      user: {},
    };
    try {
      await this.appUsersRepository.updateById(
        newUserRequest.id,
        _.omit(newUserRequest, 'email', 'password'),
      );
      const user = await this.appUsersRepository.findById(
        newUserRequest.id,
        {},
      );
      result = {
        code: 0,
        msg: 'User updated successfully.',
        user: user,
      };
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = 'Some error occurred while updating user';
    }
    return JSON.stringify(result);
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
    @param.filter(AppUsers, {exclude: 'where'})
    filter?: FilterExcludingWhere<AppUsers>,
  ): Promise<User> {
    const orders: ServiceOrders[] = await this.serviceOrdersRepository.find({
      where: {userId: id},
    });
    const appuser: AppUsers = await this.appUsersRepository.findById(
      id,
      filter,
    );
    if (orders?.length > 0) {
      appuser.totalOrders = orders?.length;
    }
    return appuser;
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
