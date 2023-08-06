import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Company,
  Account,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyAccountController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/account', {
    responses: {
      '200': {
        description: 'Company has one Account',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Account>,
  ): Promise<Account> {
    return this.companyRepository.account(id).get(filter);
  }

  @post('/companies/{id}/account', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccountInCompany',
            exclude: ['accountId'],
            optional: ['userId']
          }),
        },
      },
    }) account: Omit<Account, 'accountId'>,
  ): Promise<Account> {
    return this.companyRepository.account(id).create(account);
  }

  @patch('/companies/{id}/account', {
    responses: {
      '200': {
        description: 'Company.Account PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Partial<Account>,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.companyRepository.account(id).patch(account, where);
  }

  @del('/companies/{id}/account', {
    responses: {
      '200': {
        description: 'Company.Account DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.companyRepository.account(id).delete(where);
  }
}
