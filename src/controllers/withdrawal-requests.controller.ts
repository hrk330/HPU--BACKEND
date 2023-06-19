import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {WithdrawalRequest} from '../models';
import {WithdrawalRequestRepository} from '../repositories';

export class WithdrawalRequestsController {
  constructor(
    @repository(WithdrawalRequestRepository)
    public withdrawalRequestRepository : WithdrawalRequestRepository,
  ) {}

  @post('/withdrawalRequests')
  @response(200, {
    description: 'WithdrawalRequest model instance',
    content: {'application/json': {schema: getModelSchemaRef(WithdrawalRequest)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {
            title: 'NewWithdrawalRequest',
            exclude: ['withdrawlRequestId'],
          }),
        },
      },
    })
    withdrawalRequest: Omit<WithdrawalRequest, 'withdrawlRequestId'>,
  ): Promise<WithdrawalRequest> {
    return this.withdrawalRequestRepository.create(withdrawalRequest);
  }

  @get('/withdrawalRequests/count')
  @response(200, {
    description: 'WithdrawalRequest model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(WithdrawalRequest) where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.withdrawalRequestRepository.count(where);
  }

  @get('/withdrawalRequests')
  @response(200, {
    description: 'Array of WithdrawalRequest model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WithdrawalRequest, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(WithdrawalRequest) filter?: Filter<WithdrawalRequest>,
  ): Promise<WithdrawalRequest[]> {
    return this.withdrawalRequestRepository.find(filter);
  }

  @patch('/withdrawalRequests')
  @response(200, {
    description: 'WithdrawalRequest PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {partial: true}),
        },
      },
    })
    withdrawalRequest: WithdrawalRequest,
    @param.where(WithdrawalRequest) where?: Where<WithdrawalRequest>,
  ): Promise<Count> {
    return this.withdrawalRequestRepository.updateAll(withdrawalRequest, where);
  }

  @get('/withdrawalRequests/{id}')
  @response(200, {
    description: 'WithdrawalRequest model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WithdrawalRequest, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(WithdrawalRequest, {exclude: 'where'}) filter?: FilterExcludingWhere<WithdrawalRequest>
  ): Promise<WithdrawalRequest> {
    return this.withdrawalRequestRepository.findById(id, filter);
  }

  @patch('/withdrawalRequests/{id}')
  @response(204, {
    description: 'WithdrawalRequest PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {partial: true}),
        },
      },
    })
    withdrawalRequest: WithdrawalRequest,
  ): Promise<void> {
    await this.withdrawalRequestRepository.updateById(id, withdrawalRequest);
  }

  @put('/withdrawalRequests/{id}')
  @response(204, {
    description: 'WithdrawalRequest PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() withdrawalRequest: WithdrawalRequest,
  ): Promise<void> {
    await this.withdrawalRequestRepository.replaceById(id, withdrawalRequest);
  }

  @del('/withdrawalRequests/{id}')
  @response(204, {
    description: 'WithdrawalRequest DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.withdrawalRequestRepository.deleteById(id);
  }
}