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
  ServiceProvider,
  WithdrawalRequest,
} from '../models';
import {ServiceProviderRepository} from '../repositories';

export class ServiceProviderWithdrawalRequestController {
  constructor(
    @repository(ServiceProviderRepository) protected serviceProviderRepository: ServiceProviderRepository,
  ) { }

  @get('/service-providers/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'Array of ServiceProvider has many WithdrawalRequest',
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
    return this.serviceProviderRepository.withdrawalRequests(id).find(filter);
  }

  @post('/service-providers/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'ServiceProvider model instance',
        content: {'application/json': {schema: getModelSchemaRef(WithdrawalRequest)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ServiceProvider.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {
            title: 'NewWithdrawalRequestInServiceProvider',
            exclude: ['withdrawlRequestId'],
            optional: ['serviceProviderId']
          }),
        },
      },
    }) withdrawalRequest: Omit<WithdrawalRequest, 'withdrawlRequestId'>,
  ): Promise<WithdrawalRequest> {
    return this.serviceProviderRepository.withdrawalRequests(id).create(withdrawalRequest);
  }

  @patch('/service-providers/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'ServiceProvider.WithdrawalRequest PATCH success count',
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
    return this.serviceProviderRepository.withdrawalRequests(id).patch(withdrawalRequest, where);
  }

  @del('/service-providers/{id}/withdrawal-requests', {
    responses: {
      '200': {
        description: 'ServiceProvider.WithdrawalRequest DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(WithdrawalRequest)) where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.serviceProviderRepository.withdrawalRequests(id).delete(where);
  }
}
