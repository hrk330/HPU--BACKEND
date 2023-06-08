import {TokenService, authenticate} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, User, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, Where, repository} from '@loopback/repository';
import {del, get, getModelSchemaRef, param, patch, post, put, requestBody, response, } from '@loopback/rest';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {AppUsers, CredentialsRequest, CredentialsRequestBody, UserCreds} from '../models';
import {AppUsersRepository, VerificationCodesRepository} from '../repositories';

export class ServicesProviderController {
  constructor(
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @repository(AppUsersRepository)
    public verificationCodesRepository: VerificationCodesRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
  ) { }

  @post('/serviceProvider/signup')
  @response(200, {
    description: 'AppUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(AppUsers)}},
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'serviceProvider',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceProvider: Omit<AppUsers, 'id'>,
  ): Promise<String> {

    let result = {code: 5, msg: "User registeration failed.", token: '', userId: ''};
    try {
      const filter = {where: {email: serviceProvider.email}};
      const user = await this.appUsersRepository.findOne(filter);

      if (user?.id) {
        result = {code: 5, msg: "User already exists", token: '', userId: ''};
      } else {
        const salt = await genSalt();
        const password = await hash(serviceProvider.password, salt);
        serviceProvider.roleId = "SERVICEPROVIDER";
        serviceProvider.isServiceProviderVerified = "N";
        const savedUser = await this.appUsersRepository.create(
          _.omit(serviceProvider, 'password'),
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

  @post('/serviceProvider/login', {
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
    const result = {code: 5, msg: "Invalid email or password.", token: '', user: {}};
    try {
      const filter = {where: {email: credentials.email}, include: [{'relation': 'userCreds'}]};
      const user = await this.appUsersRepository.findOne(filter);

      //const user = await this.userService.verifyCredentials(credentials);
      if (user?.userCreds) {
        const salt = user.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === user.userCreds.password) {

          //this.appUsersRepository.updateById(id, appUsers)
          // convert a User object into a UserProfile object (reduced set of properties)

          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
          user.userCreds = new UserCreds();
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

  @authenticate('jwt')
  @post('/serviceProvider/updateProfile')
  @response(200, {
    description: 'AppUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(AppUsers)}},
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
    serviceProvider: AppUsers,
  ): Promise<String> {
    let result = {code: 5, msg: "Some error occured while updating profile.", user: {}};
    try {
      await this.appUsersRepository.updateById(serviceProvider.id, _.omit(serviceProvider, 'email', 'phoneNo'));
      const user = await this.appUsersRepository.findById(serviceProvider.id, {});
      if (user) {
        result = {code: 0, msg: "User profile updated successfully.", user: user};
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/serviceProvider/updateEndpoint', {
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
    await this.appUsersRepository.updateById(newUserRequest.id, _.pick(newUserRequest, 'endpoint'));
    const user = await this.appUsersRepository.findById(newUserRequest.id, {});
    const result = {code: 0, msg: "Endpoint updated successfully.", user: user};
    return JSON.stringify(result);
  }

  @post('/serviceProvider')
  @response(200, {
    description: 'AppUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(AppUsers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AppUsers, {
            title: 'NewAppUsers',
            exclude: ['id'],
          }),
        },
      },
    })
    appUsers: Omit<AppUsers, 'id'>,
  ): Promise<AppUsers> {
    return this.appUsersRepository.create(appUsers);
  }

  @get('/serviceProvider/count')
  @response(200, {
    description: 'AppUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AppUsers) where?: Where<AppUsers>,
  ): Promise<Count> {
    return this.appUsersRepository.count(where);
  }

  @get('/serviceProvider')
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
  ): Promise<AppUsers[]> {
    return this.appUsersRepository.find(filter);
  }

  @patch('/serviceProvider')
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
    return this.appUsersRepository.updateAll(appUsers, where);
  }

  @get('/serviceProvider/{id}')
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
  ): Promise<AppUsers> {
    return this.appUsersRepository.findById(id, filter);
  }

  @patch('/serviceProvider/{id}')
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

  @put('/serviceProvider/{id}')
  @response(204, {
    description: 'AppUsers PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() appUsers: AppUsers,
  ): Promise<void> {
    await this.appUsersRepository.replaceById(id, appUsers);
  }

  @del('/serviceProvider/{id}')
  @response(204, {
    description: 'AppUsers DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.appUsersRepository.deleteById(id);
  }
}
