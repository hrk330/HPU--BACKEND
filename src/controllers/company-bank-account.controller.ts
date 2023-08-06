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
  BankAccount,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyBankAccountController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/bank-account', {
    responses: {
      '200': {
        description: 'Company has one BankAccount',
        content: {
          'application/json': {
            schema: getModelSchemaRef(BankAccount),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<BankAccount>,
  ): Promise<BankAccount> {
    return this.companyRepository.bankAccount(id).get(filter);
  }

  @post('/companies/{id}/bank-account', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: {'application/json': {schema: getModelSchemaRef(BankAccount)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BankAccount, {
            title: 'NewBankAccountInCompany',
            exclude: ['bankAccountId'],
            optional: ['userId']
          }),
        },
      },
    }) bankAccount: Omit<BankAccount, 'bankAccountId'>,
  ): Promise<BankAccount> {
    return this.companyRepository.bankAccount(id).create(bankAccount);
  }

  @patch('/companies/{id}/bank-account', {
    responses: {
      '200': {
        description: 'Company.BankAccount PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(BankAccount, {partial: true}),
        },
      },
    })
    bankAccount: Partial<BankAccount>,
    @param.query.object('where', getWhereSchemaFor(BankAccount)) where?: Where<BankAccount>,
  ): Promise<Count> {
    return this.companyRepository.bankAccount(id).patch(bankAccount, where);
  }

  @del('/companies/{id}/bank-account', {
    responses: {
      '200': {
        description: 'Company.BankAccount DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(BankAccount)) where?: Where<BankAccount>,
  ): Promise<Count> {
    return this.companyRepository.bankAccount(id).delete(where);
  }
}
