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
import {AppUsers, WithdrawalRequest} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersWithdrawalRequestController {
  constructor(
    @repository(AppUsersRepository)
    protected appUsersRepository: AppUsersRepository,
  ) {}

  @get('/app-users/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Array of AppUsers has many WithdrawalRequest',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(WithdrawalRequest),
            },
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<WithdrawalRequest>,
  ): Promise<WithdrawalRequest[]> {
    return this.appUsersRepository.withdrawalRequests(id).find(filter);
  }

  @post('/app-users/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(WithdrawalRequest)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {
            title: 'NewWithdrawalRequestInAppUsers',
            exclude: ['withdrawlRequestId'],
            optional: ['serviceProviderId'],
          }),
        },
      },
    })
    withdrawalRequest: Omit<WithdrawalRequest, 'withdrawlRequestId'>,
  ): Promise<WithdrawalRequest> {
    return this.appUsersRepository
      .withdrawalRequests(id)
      .create(withdrawalRequest);
  }

  @patch('/app-users/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'AppUsers.WithdrawalRequest PATCH success count',
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
    @param.query.object('where', getWhereSchemaFor(WithdrawalRequest))
    where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.appUsersRepository
      .withdrawalRequests(id)
      .patch(withdrawalRequest, where);
  }

  @del('/app-users/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'AppUsers.WithdrawalRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WithdrawalRequest))
    where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.appUsersRepository.withdrawalRequests(id).delete(where);
  }
}
