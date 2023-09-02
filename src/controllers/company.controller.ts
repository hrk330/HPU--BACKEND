import {Filter, repository} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {
  BankAccount,
  Company,
  CredentialsRequest,
  CredentialsRequestBody,
  ServiceOrders,
  ServiceProvider,
  Services,
  UserCreds,
} from '../models';
import {
  CompanyRepository,
  ServiceOrdersRepository,
  ServiceProviderRepository,
  ServicesRepository,
} from '../repositories';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {
  MyUserService,
  TokenServiceBindings,
  UserServiceBindings,
} from '@loopback/authentication-jwt';
import {authenticate, TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import { ChangePasswordRequest } from '../interfaces';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository: CompanyRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @post('/companies/login', {
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
      company: {},
    };
    try {
      const filter = {
        where: {email: credentials.email},
        include: [{relation: 'userCreds'}],
      };
      const dbCompany = await this.companyRepository.findOne(filter);

      //const user = await this.userService.verifyCredentials(credentials);
      if (dbCompany?.userCreds) {
        const salt = dbCompany.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === dbCompany.userCreds.password) {
          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(
            this.userService.convertToUserProfile(dbCompany),
          );
          dbCompany.userCreds = new UserCreds();
          result.company = dbCompany;
          result.code = 0;
          result.msg = 'Logged in successfully.';
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/companies/createCompany')
  @response(200, {
    description: 'Company model instance',
    content: {'application/json': {schema: getModelSchemaRef(Company)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewCompany',
            exclude: ['id'],
          }),
        },
      },
    })
    company: Omit<Company, 'companyId'>,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occurred.',
      company: {},
      token: '',
    };
    try {
      const filter = {where: {email: company.email}};
      const dbCompany = await this.companyRepository.findOne(filter);

      if (dbCompany?.id) {
        result.code = 5;
        result.msg = 'Company already exists.';
      } else {
        const salt = await genSalt();
        const password = await hash(company.password, salt);
        const savedCompany = await this.companyRepository.create(
          _.omit(company, 'password', 'bankAccountInfo'),
        );
        if (savedCompany) {
          await this.companyRepository
            .userCreds(savedCompany.id)
            .create({password, salt});
          await this.companyRepository
            .account(savedCompany.id)
            .create({balanceAmount: 0});
          savedCompany.bankAccount = await this.companyRepository
            .bankAccount(savedCompany.id)
            .create(company.bankAccountInfo);

          result.company = savedCompany;
          result.code = 0;
          result.msg = 'Company registered successfully.';
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }
  
  
  @post('/companies/changePassword', {
    responses: {
      '200': {
        description: 'User',
        content: 'ChangePasswordRequest',
      },
    },
  })
  async changePassword(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {
            title: 'NewUser',
            partial: true,
          }),
        },
      },
    })
    changePasswordRequest: ChangePasswordRequest,
  ): Promise<String> {
    const result = {code: 5, msg: 'Change password failed.'};

    const dbCompany = await this.companyRepository.findOne({
			where: {id: changePasswordRequest.id},
			include: [{relation: 'userCreds'}],
		});
		
    if (dbCompany?.userCreds) {
      let salt = dbCompany.userCreds.salt;
      let password = await hash(changePasswordRequest.oldPassword, salt);
      if (password === dbCompany.userCreds.password) {
      	salt = await genSalt();
    		password = await hash(changePasswordRequest.newPassword, salt);
	      const updatedAt = new Date();
	      await this.companyRepository
	        .userCreds(dbCompany.id)
	        .patch({password, salt, updatedAt});
	      result.code = 0;
	      result.msg = 'Password has been changed successfully.';
      }
    }

    return JSON.stringify(result);
  }

  @get('/companies/getCompanies')
  @response(200, {
    description: 'Array of Company model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Company, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Company) filter?: Filter<Company>): Promise<string> {
    const result = {code: 5, msg: 'Some error occurred.', companies: {}};
    try {
      const comapnaies: Company[] = await this.companyRepository.find(filter);
      if (comapnaies?.length > 0) {
        comapnaies.forEach((company: Company) => {
          company.totalRiders = company?.serviceProviders?.length;
        });
      }
      result.companies = comapnaies;
      result.code = 0;
      result.msg = 'Companies fetched successfully.';
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @get('/companies/getCompanyDetails/{id}')
  @response(200, {
    description: 'Company model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Company, {includeRelations: true}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occurred.',
      company: {},
      token: '',
    };
    try {
      const dbCompany = await this.companyRepository.findOne({
        where: {id: id},
        include: [{relation: 'bankAccount'}],
      });
      if (dbCompany?.id) {
        dbCompany.bankAccountInfo = dbCompany.bankAccount;
        dbCompany.bankAccount = new BankAccount();
        result.company = dbCompany;
        result.code = 0;
        result.msg = 'Company fetched successfully.';
      } else {
        result.code = 5;
        result.msg = 'Company does not exists.';
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/companies/updateCompany/{id}')
  @response(200, {
    description: 'Company PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Company, {partial: true}),
        },
      },
    })
    company: Company,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occurred.',
      company: {},
      token: '',
    };
    try {
      let dbCompany = await this.companyRepository.findOne({
        where: {id: id},
        include: [{relation: 'userCreds'}],
      });

      if (dbCompany?.id) {
        if (company.password && dbCompany?.userCreds) {
          const password = await hash(
            company.password,
            dbCompany.userCreds.salt,
          );
          await this.companyRepository.userCreds(company.id).patch({password});
        }
        await this.companyRepository
          .bankAccount(company.id)
          .patch(company.bankAccountInfo);
        await this.companyRepository.updateById(
          id,
          _.omit(company, 'password', 'email', 'bankAccountInfo'),
        );
        dbCompany = await this.companyRepository.findOne({
          where: {id: id, email: company.email},
          include: [{relation: 'bankAccount'}],
        });
        if (dbCompany) {
          result.company = dbCompany;
          result.code = 0;
          result.msg = 'Company updated successfully.';
        }
      } else {
        result.code = 5;
        result.msg = 'Company does not exists.';
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @authenticate('jwt')
  @get('/companies/getServiceProviders/{companyId}')
  @response(200, {
    description: 'Array of ServiceOrders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
        },
      },
    },
  })
  async findCompanyServiceProviders(
    @param.path.string('companyId') companyId: string,
    @param.filter(ServiceProvider) filter?: Filter<ServiceProvider>,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occured while getting serviceProviders.',
      serviceProviders: {},
    };
    try {
      const dbCompany = await this.companyRepository.findById(companyId);

      if (dbCompany) {
        if (filter) {
          filter.where = {
            ...filter.where,
            companyId: companyId,
            serviceProviderType: dbCompany.companyType,
          };
          if (filter.limit && filter.limit > 50) {
            filter = {...filter, limit: 50};
          }
        } else {
          filter = {
            where: {
              companyId: companyId,
              serviceProviderType: dbCompany.companyType,
            },
            limit: 50,
          };
        }

        const serviceProviders: ServiceProvider[] =
          await this.serviceProviderRepository.find(filter);
        result = {
          code: 0,
          msg: 'ServiceProviders fetched successfully.',
          serviceProviders: serviceProviders,
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
  @get('/companies/getOrders/{companyId}')
  @response(200, {
    description: 'Array of ServiceOrders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
        },
      },
    },
  })
  async findCompanyOrders(
    @param.path.string('companyId') companyId: string,
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occured while getting orders.',
      orders: {},
    };
    try {
      const dbCompany = await this.companyRepository.findById(companyId);

      if (dbCompany) {
        const serviceIdArray: string[] = await this.getServiceIdArrayForOrder(
          dbCompany.companyType,
        );
        if (serviceIdArray?.length > 0) {
          if (filter) {
            filter.where = {
              ...filter.where,
              companyId: companyId,
              serviceId: {inq: serviceIdArray},
            };
          } else {
            filter = {
              where: {
                companyId: companyId,
                serviceId: {inq: serviceIdArray},
              },
            };
          }
          const orders: ServiceOrders[] =
            await this.serviceOrdersRepository.find(filter);
          result = {
            code: 0,
            msg: 'Orders fetched successfully.',
            orders: orders,
          };
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  async getServiceIdArrayForOrder(companyType: string): Promise<string[]> {
    const requiredServiceTypeArray: string[] = [];
    let serviceArray: Services[] = [];
    if (companyType === 'DFY') {
      requiredServiceTypeArray.push('Done For You');
    } else if (companyType === 'SP') {
      requiredServiceTypeArray.push('General Assistance');
      requiredServiceTypeArray.push('Car Tow');
    }
    if (requiredServiceTypeArray.length > 0) {
      serviceArray = await this.servicesRepository.find({
        where: {serviceType: {inq: requiredServiceTypeArray}},
        fields: ['serviceId'],
      });
    }
    return serviceArray.length > 0
      ? serviceArray.map(service => service.serviceId)
      : [];
  }
}
