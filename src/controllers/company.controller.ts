import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  requestBody,
  response,
} from '@loopback/rest';
import {Company, CredentialsRequest, CredentialsRequestBody, UserCreds} from '../models';
import {CompanyRepository} from '../repositories';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import { MyUserService, TokenServiceBindings, UserServiceBindings } from '@loopback/authentication-jwt';
import { TokenService } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class CompanyController {
  constructor(
    @repository(CompanyRepository)
    public companyRepository : CompanyRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
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
    const result = {code: 5, msg: "Invalid email or password.", token: '', company: {}};
    try {
      const filter = {where: {email: credentials.email}, include: [{'relation': 'userCreds'}]};
      const dbCompany = await this.companyRepository.findOne(filter);

      //const user = await this.userService.verifyCredentials(credentials);
      if (dbCompany?.userCreds) {
        const salt = dbCompany.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === dbCompany.userCreds.password) {

          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(dbCompany));
          dbCompany.userCreds = new UserCreds();
          result.company = dbCompany;
          result.code = 0;
          result.msg = "Logged in successfully.";
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
	  const result = {code: 5, msg: "Some error occurred.", company: {}, token: ''};
    try {
      const filter = {where: {email: company.email}};
      const dbCompany = await this.companyRepository.findOne(filter);

      if (dbCompany?.id) {
        result.code = 5;
        result.msg = "Company already exists.";
      } else {
        const salt = await genSalt();
        const password = await hash(company.password, salt);
        const savedCompany = await this.companyRepository.create(_.omit(company, 'password'));
        if (savedCompany) {
          await this.companyRepository.userCreds(savedCompany.id).create({password, salt});
          await this.companyRepository.account(savedCompany.id).create({balanceAmount: 0});
          await this.companyRepository.bankAccount(savedCompany.id).create(company.bankAccountInfo);
          const userProfile = this.userService.convertToUserProfile(savedCompany);

          result.company = savedCompany;
          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(userProfile);
          result.code = 0;
          result.msg = "Company registered successfully.";
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
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
  async find(
    @param.filter(Company) filter?: Filter<Company>,
  ): Promise<Company[]> {
    return this.companyRepository.find(filter);
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
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Company, {exclude: 'where'}) filter?: FilterExcludingWhere<Company>
  ): Promise<Company> {
    return this.companyRepository.findById(id, filter);
  }

  @patch('/companies/updateCompany/{id}')
  @response(204, {
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
  ): Promise<void> {
    await this.companyRepository.updateById(id, company);
  }
}
