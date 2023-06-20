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
  Account,
  WithdrawalRequest,
} from '../models';
import {AccountRepository} from '../repositories';

export class AccountWithdrawalRequestController {
  constructor(
    @repository(AccountRepository) protected accountRepository: AccountRepository,
  ) { }

  @get('/accounts/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Array of Account has many WithdrawalRequest',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(WithdrawalRequest)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<WithdrawalRequest>,
  ): Promise<WithdrawalRequest[]> {
    return this.accountRepository.withdrawalRequests(id).find(filter);
  }

  @post('/accounts/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Account model instance',
        content: {'application/json': {schema: getModelSchemaRef(WithdrawalRequest)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Account.prototype.accountId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {
            title: 'NewWithdrawalRequestInAccount',
            exclude: ['withdrawlRequestId'],
            optional: ['userAccountId']
          }),
        },
      },
    }) withdrawalRequest: Omit<WithdrawalRequest, 'withdrawlRequestId'>,
  ): Promise<WithdrawalRequest> {
    return this.accountRepository.withdrawalRequests(id).create(withdrawalRequest);
  }

  @patch('/accounts/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Account.WithdrawalRequest PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {partial: true}),
        },
      },
    })
    withdrawalRequest: Partial<WithdrawalRequest>,
    @param.query.object('where', getWhereSchemaFor(WithdrawalRequest)) where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.accountRepository.withdrawalRequests(id).patch(withdrawalRequest, where);
  }

  @del('/accounts/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Account.WithdrawalRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WithdrawalRequest)) where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.accountRepository.withdrawalRequests(id).delete(where);
  }
}
