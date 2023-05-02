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
import {ServiceOrders} from '../models';
import {ServiceOrdersRepository} from '../repositories';

export class ServiceOrdersController {
  constructor(
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository : ServiceOrdersRepository,
  ) {}

  @post('/serviceOrders')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {
            title: 'NewServiceOrders',
            exclude: ['id'],
          }),
        },
      },
    })
    serviceOrders: Omit<ServiceOrders, 'id'>,
  ): Promise<ServiceOrders> {
    return this.serviceOrdersRepository.create(serviceOrders);
  }

  @get('/serviceOrders/count')
  @response(200, {
    description: 'ServiceOrders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ServiceOrders) where?: Where<ServiceOrders>,
  ): Promise<Count> {
    return this.serviceOrdersRepository.count(where);
  }

  @get('/serviceOrders')
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
  async find(
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<ServiceOrders[]> {
    return this.serviceOrdersRepository.find(filter);
  }

  @patch('/serviceOrders')
  @response(200, {
    description: 'ServiceOrders PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
    @param.where(ServiceOrders) where?: Where<ServiceOrders>,
  ): Promise<Count> {
    return this.serviceOrdersRepository.updateAll(serviceOrders, where);
  }

  @get('/serviceOrders/{id}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ServiceOrders, {exclude: 'where'}) filter?: FilterExcludingWhere<ServiceOrders>
  ): Promise<ServiceOrders> {
    return this.serviceOrdersRepository.findById(id, filter);
  }

  @patch('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<void> {
    await this.serviceOrdersRepository.updateById(id, serviceOrders);
  }

  @put('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() serviceOrders: ServiceOrders,
  ): Promise<void> {
    await this.serviceOrdersRepository.replaceById(id, serviceOrders);
  }

  @del('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.serviceOrdersRepository.deleteById(id);
  }
}
