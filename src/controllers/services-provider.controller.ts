import {TokenService, authenticate} from '@loopback/authentication';
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
  Where,
  repository,
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
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {
  CredentialsRequest,
  CredentialsRequestBody,
  ServiceProvider,
  ServiceProviderServices,
  Services,
  UserCreds,
} from '../models';
import {
  ServiceProviderRepository,
  ServiceProviderServicesRepository,
  ServicesRepository,
} from '../repositories';

export class ServicesProviderController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(ServiceProviderServicesRepository)
    public serviceProviderServicesRepository: ServiceProviderServicesRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @post('/serviceProvider/signup')
  @response(200, {
    description: 'AppUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProvider)}},
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'serviceProvider',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceProvider: Omit<ServiceProvider, 'id'>,
  ): Promise<String> {
    let result = {
      code: 5,
      msg: 'User registeration failed.',
      token: '',
      userId: '',
    };
    try {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          serviceProvider.email,
        )
      ) {
        const user = await this.serviceProviderRepository.findOne({
          where: {email: serviceProvider.email, roleId: 'SERVICEPROVIDER'},
        });

        if (user?.id) {
          result = {code: 5, msg: 'User already exists', token: '', userId: ''};
        } else {
          const salt = await genSalt();
          const password = await hash(serviceProvider.password, salt);
          serviceProvider.roleId = 'SERVICEPROVIDER';
          serviceProvider.isServiceProviderVerified = 'N';
          const savedUser = await this.serviceProviderRepository.create(
            _.omit(serviceProvider, 'password'),
          );
          if (savedUser) {
            await this.serviceProviderRepository
              .account(savedUser.id)
              .create({balanceAmount: 0});
            await this.serviceProviderRepository
              .userCreds(savedUser.id)
              .create({password, salt});
            const userProfile =
              this.userService.convertToUserProfile(savedUser);

            result.userId = savedUser.id;
            // create a JSON Web Token based on the user profile
            result.token = await this.jwtService.generateToken(userProfile);
            result.code = 0;
            result.msg = 'User registered successfully.';
          }
        }
      } else {
        result.msg = 'Enter valid email.';
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/serviceProvider/admin/createServiceProvider')
  @response(200, {
    description: 'ServiceProvider model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProvider)}},
  })
  async createServiceProviderByAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'serviceProvider',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceProvider: Omit<ServiceProvider, 'id'>,
  ): Promise<String> {
    let result = {code: 5, msg: 'User registeration failed.', user: {}};
    try {
      if (
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
          serviceProvider.email,
        )
      ) {
        const user = await this.serviceProviderRepository.findOne({
          where: {email: serviceProvider.email, roleId: 'SERVICEPROVIDER'},
        });

        if (user?.id) {
          result = {code: 5, msg: 'User already exists', user: {}};
        } else {
          const salt = await genSalt();
          const password = await hash(serviceProvider.password, salt);
          serviceProvider.roleId = 'SERVICEPROVIDER';
          serviceProvider.isServiceProviderVerified = 'N';
          const savedUser = await this.serviceProviderRepository.create(
            _.omit(serviceProvider, 'password'),
          );
          if (savedUser) {
            await this.serviceProviderRepository
              .account(savedUser.id)
              .create({balanceAmount: 0});
            await this.serviceProviderRepository
              .userCreds(savedUser.id)
              .create({password, salt});

            const servicesArray: Array<string> = [];
            const serviceProviderServiceMap = new Map<
              string,
              ServiceProviderServices
            >();
            if (
              Array.isArray(serviceProvider?.serviceProviderServicesList) &&
              serviceProvider?.serviceProviderServicesList?.length > 0
            ) {
              serviceProvider?.serviceProviderServicesList.forEach(
                (serviceProviderService: ServiceProviderServices) => {
                  if (serviceProviderService?.serviceId) {
                    servicesArray.push(serviceProviderService?.serviceId);
                    serviceProviderServiceMap.set(
                      serviceProviderService?.serviceId,
                      serviceProviderService,
                    );
                  }
                },
              );
              serviceProvider.serviceProviderServicesList = [];
              const finalServicesArray: Services[] =
                await this.checkServicesExist(servicesArray);
              const serviceProviderServicesList: ServiceProviderServices[] = [];
              for (const finalService of finalServicesArray) {
                const serviceProviderServices:
                  | ServiceProviderServices
                  | undefined = serviceProviderServiceMap.get(
                  finalService.serviceId + '',
                );
                if (serviceProviderServices?.serviceId && savedUser.id) {
                  const serviceProviderServiceArray: Array<ServiceProviderServices> =
                    await this.checkServiceProviderServiceExist(
                      serviceProviderServices?.serviceId,
                      savedUser.id,
                    );
                  if (
                    !serviceProviderServiceArray ||
                    serviceProviderServiceArray?.length === 0
                  ) {
                    const serviceProviderServiceObject: ServiceProviderServices =
                      new ServiceProviderServices();
                    serviceProviderServiceObject.serviceId =
                      serviceProviderServices.serviceId;
                    serviceProviderServiceObject.isActive =
                      serviceProviderServices.isActive;
                    serviceProviderServiceObject.userId = savedUser.id;
                    serviceProviderServiceObject.serviceName =
                      finalService.serviceName;
                    serviceProviderServiceObject.serviceType =
                      finalService.serviceType;
                    serviceProviderServiceObject.vehicleType =
                      finalService.vehicleType;
                    serviceProviderServiceObject.accidental =
                      finalService.accidental;
                    serviceProviderServicesList.push(
                      await this.serviceProviderServicesRepository.create(
                        serviceProviderServiceObject,
                      ),
                    );
                  }
                }
              }
              savedUser.serviceProviderServicesList =
                serviceProviderServicesList;
            }

            result.code = 0;
            result.msg = 'Service provider created successfully.';
            result.user = savedUser;
          }
        }
      } else {
        result.msg = 'Enter valid email.';
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/serviceProvider/admin/updateServiceProvider')
  @response(200, {
    description: 'ServiceProvider model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProvider)}},
  })
  async updateServiceProviderByAdmin(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
          }),
        },
      },
    })
    serviceProvider: ServiceProvider,
  ): Promise<String> {
    let result = {
      code: 5,
      msg: 'Some error occured while updating service provider.',
      user: {},
    };
    try {
      await this.serviceProviderRepository.updateById(
        serviceProvider.id,
        serviceProvider,
      );
      const user = await this.serviceProviderRepository.findById(
        serviceProvider.id,
        {},
      );
      if (user) {
        const servicesArray: Array<string> = [];
        const serviceProviderServiceMap = new Map<
          string,
          ServiceProviderServices
        >();
        if (
          Array.isArray(serviceProvider?.serviceProviderServicesList) &&
          serviceProvider?.serviceProviderServicesList?.length > 0
        ) {
          serviceProvider.serviceProviderServicesList.forEach(
            (serviceProviderService: ServiceProviderServices) => {
              if (serviceProviderService?.serviceId) {
                servicesArray.push(serviceProviderService?.serviceId);
                serviceProviderServiceMap.set(
                  serviceProviderService?.serviceId,
                  serviceProviderService,
                );
              }
            },
          );
          serviceProvider.serviceProviderServicesList = [];
          const finalServicesArray: Services[] = await this.checkServicesExist(
            servicesArray,
          );
          const serviceProviderServicesList: ServiceProviderServices[] = [];
          for (const finalService of finalServicesArray) {
            const serviceProviderServices: ServiceProviderServices | undefined =
              serviceProviderServiceMap.get(finalService.serviceId + '');
            if (serviceProviderServices?.serviceId && user.id) {
              const serviceProviderServiceArray: Array<ServiceProviderServices> =
                await this.checkServiceProviderServiceExist(
                  serviceProviderServices?.serviceId,
                  user.id,
                );
              if (
                !serviceProviderServiceArray ||
                serviceProviderServiceArray?.length === 0
              ) {
                const serviceProviderServiceObject: ServiceProviderServices =
                  new ServiceProviderServices();
                serviceProviderServiceObject.serviceId =
                  serviceProviderServices.serviceId;
                serviceProviderServiceObject.isActive =
                  serviceProviderServices.isActive;
                serviceProviderServiceObject.userId = user.id;
                serviceProviderServiceObject.serviceName =
                  finalService.serviceName;
                serviceProviderServiceObject.serviceType =
                  finalService.serviceType;
                serviceProviderServiceObject.vehicleType =
                  finalService.vehicleType;
                serviceProviderServiceObject.accidental =
                  finalService.accidental;
                serviceProviderServicesList.push(
                  await this.serviceProviderServicesRepository.create(
                    serviceProviderServiceObject,
                  ),
                );
              } else if (serviceProviderServiceArray?.length > 0) {
                serviceProviderServices.updatedAt = new Date();
                await this.serviceProviderServicesRepository.updateById(
                  serviceProviderServices.id,
                  serviceProviderServices,
                );
                serviceProviderServicesList.push(
                  await this.serviceProviderServicesRepository.findById(
                    serviceProviderServices.id,
                  ),
                );
              }
            }
          }
          user.serviceProviderServicesList = serviceProviderServicesList;
        }
        result = {
          code: 0,
          msg: 'Service provider updated successfully.',
          user: user,
        };
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  async checkServicesExist(
    servicesArray: Array<string>,
  ): Promise<Array<Services>> {
    const finalServicesArray: Array<Services> =
      await this.servicesRepository.find({
        where: {serviceId: {inq: servicesArray}},
        fields: ['serviceId', 'serviceName', 'serviceType', 'vehicleType'],
      });
    return finalServicesArray;
  }

  async checkServiceProviderServiceExist(
    serviceId: string,
    userId: string,
  ): Promise<Array<ServiceProviderServices>> {
    const serviceProviderServiceArray: Array<ServiceProviderServices> =
      await this.serviceProviderServicesRepository.find({
        where: {serviceId: serviceId, userId: userId},
        fields: ['serviceId'],
      });
    return serviceProviderServiceArray;
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
    const result = {
      code: 5,
      msg: 'Invalid email or password.',
      token: '',
      user: {},
    };
    try {
      const user = await this.serviceProviderRepository.findOne({
        where: {email: credentials.email, roleId: 'SERVICEPROVIDER'},
        include: [{relation: 'userCreds'}],
      });

      //const user = await this.userService.verifyCredentials(credentials);
      if (user?.userCreds) {
        const salt = user.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === user.userCreds.password) {
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
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/serviceProvider/resetPassword', {
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
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
            partial: true,
          }),
        },
      },
    })
    newUserRequest: ServiceProvider,
  ): Promise<String> {
    const result = {code: 5, msg: 'Reset password failed.'};

    const user = await this.serviceProviderRepository.findOne({
      where: {email: newUserRequest.email, roleId: 'SERVICEPROVIDER'},
    });
    if (user) {
      const salt = await genSalt();
      const password = await hash(newUserRequest.password, salt);
      const updatedAt = new Date();
      await this.serviceProviderRepository
        .userCreds(user.id)
        .patch({password, salt, updatedAt});
      result.code = 0;
      result.msg = 'Password has been reset successfully.';
    }

    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/serviceProvider/updateProfile')
  @response(200, {
    description: 'ServiceProvider model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProvider)}},
  })
  async updateProfile(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
          }),
        },
      },
    })
    serviceProvider: ServiceProvider,
  ): Promise<String> {
    let result = {
      code: 5,
      msg: 'Some error occured while updating profile.',
      user: {},
    };
    try {
      await this.serviceProviderRepository.updateById(
        serviceProvider.id,
        _.omit(serviceProvider, 'email', 'phoneNo'),
      );
      const user = await this.serviceProviderRepository.findById(
        serviceProvider.id,
        {},
      );
      if (user) {
        result = {
          code: 0,
          msg: 'User profile updated successfully.',
          user: user,
        };
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
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: ServiceProvider,
  ): Promise<String> {
    await this.serviceProviderRepository.updateById(
      newUserRequest.id,
      _.pick(newUserRequest, 'endpoint'),
    );
    const user = await this.serviceProviderRepository.findById(
      newUserRequest.id,
      {},
    );
    const result = {code: 0, msg: 'Endpoint updated successfully.', user: user};
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @post('/serviceProvider/approveServiceProvider', {
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
  async approveServiceProvider(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: ServiceProvider,
  ): Promise<String> {
    await this.serviceProviderRepository.updateById(newUserRequest.id, {
      userStatus: 'A',
    });
    await this.serviceProviderRepository
      .userDocs(newUserRequest.id)
      .patch(
        {docStatus: 'A'},
        {docType: {inq: ['DL', 'VR', 'VFC', 'CPR', 'RL1', 'RL2']}},
      );
    const user = await this.serviceProviderRepository.findById(
      newUserRequest.id,
      {},
    );
    const result = {code: 0, msg: 'User approved successfully.', user: user};
    return JSON.stringify(result);
  }

  @get('/serviceProvider/adminUser/fetchAllPendingServiceProviders')
  @response(200, {
    description: 'Array of ServiceProvider model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceProvider, {includeRelations: true}),
        },
      },
    },
  })
  async fetchAllPendingServiceProviders(
    @param.filter(ServiceProvider) filter?: Filter<ServiceProvider>,
  ): Promise<ServiceProvider[]> {
    return this.serviceProviderRepository.find({
      where: {roleId: 'SERVICEPROVIDER', userStatus: 'P'},
    });
  }

  @get('/serviceProvider/getSearchedUsers/{email}')
  @response(200, {
    description: 'Array of ServiceProvider model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceProvider, {includeRelations: true}),
        },
      },
    },
  })
  async findByEmail(
    @param.path.string('email') email: string,
  ): Promise<User[]> {
    return this.serviceProviderRepository.find({
      where: {roleId: 'SERVICEPROVIDER', email: {like: email}},
      limit: 10,
      fields: ['id', 'email'],
    });
  }

  @authenticate('jwt')
  @post('/serviceProvider/logoutServiceProvider', {
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
  async logoutServiceProvider(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewUser',
          }),
        },
      },
    })
    newUserRequest: ServiceProvider,
  ): Promise<String> {
    await this.serviceProviderRepository.updateById(newUserRequest.id, {
      endpoint: '',
    });
    const result = {code: 0, msg: 'User logged out successfully.'};
    return JSON.stringify(result);
  }

  @post('/serviceProvider')
  @response(200, {
    description: 'ServiceProvider model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProvider)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewServiceProvider',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceProvider: Omit<ServiceProvider, 'id'>,
  ): Promise<ServiceProvider> {
    return this.serviceProviderRepository.create(serviceProvider);
  }

  @get('/serviceProvider/count')
  @response(200, {
    description: 'ServiceProvider model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ServiceProvider) where?: Where<ServiceProvider>,
  ): Promise<Count> {
    return this.serviceProviderRepository.count(where);
  }

  @get('/serviceProvider')
  @response(200, {
    description: 'Array of ServiceProvider model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceProvider, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ServiceProvider) filter?: Filter<ServiceProvider>,
  ): Promise<ServiceProvider[]> {
    return this.serviceProviderRepository.find(filter);
  }

  @patch('/serviceProvider')
  @response(200, {
    description: 'ServiceProvider PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {partial: true}),
        },
      },
    })
    appUsers: ServiceProvider,
    @param.where(ServiceProvider) where?: Where<ServiceProvider>,
  ): Promise<Count> {
    return this.serviceProviderRepository.updateAll(appUsers, where);
  }

  @get('/serviceProvider/{id}')
  @response(200, {
    description: 'ServiceProvider model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceProvider, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ServiceProvider, {exclude: 'where'})
    filter?: FilterExcludingWhere<ServiceProvider>,
  ): Promise<ServiceProvider> {
    return this.serviceProviderRepository.findById(id, filter);
  }

  @patch('/serviceProvider/{id}')
  @response(204, {
    description: 'ServiceProvider PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {partial: true}),
        },
      },
    })
    appUsers: ServiceProvider,
  ): Promise<void> {
    await this.serviceProviderRepository.updateById(id, appUsers);
  }

  @put('/serviceProvider/{id}')
  @response(204, {
    description: 'ServiceProvider PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() appUsers: ServiceProvider,
  ): Promise<void> {
    await this.serviceProviderRepository.replaceById(id, appUsers);
  }

  @del('/serviceProvider/{id}')
  @response(204, {
    description: 'ServiceProvider DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.serviceProviderRepository.deleteById(id);
  }
}
