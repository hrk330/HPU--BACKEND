import {
  Count,
  CountSchema,
  FilterExcludingWhere,
  repository,
  Where
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
import {ServiceOrders} from '../models';
import {ServiceOrdersRepository} from '../repositories';
import {sendMessage} from '../services/firebase-notification.service';

export class ServiceOrdersController {
  constructor(
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
  ) { }

  @post('/serviceOrders/createOrder')
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
            exclude: ['serviceOrderId'],
          }),
        },
      },
    })
    serviceOrders: Omit<ServiceOrders, 'serviceOrderId'>,
  ): Promise<ServiceOrders> {
    return this.serviceOrdersRepository.create(serviceOrders);
  }

  @get('/serviceOrders/getAllOrders/{id}')
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
    @param.path.string('id') serviceProviderId: string,
  ): Promise<Object> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (serviceProviderId && serviceProviderId.length > 0) {
        const orders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceProviderId: serviceProviderId}})
        result = {code: 0, msg: "Orders fetched successfully.", orders: orders};
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
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

  @get('/serviceOrders/sendNotification/{token}')
  @response(200, {
    description: 'ServiceOrders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async sendNotification(
    @param.path.string('token') token: string,
  ): Promise<string> {
    await sendMessage({notification: {title: "Test Notification ", body: "This is a sample test msg."}, token: token});
    return "SUCCESS";
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

  @get('/serviceOrders/getServiceOrder/{serviceOrderId}/{serviceProviderId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('serviceOrderId') serviceOrderId: string,
    @param.path.string('serviceProviderId') serviceProviderId: string,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (serviceProviderId && serviceProviderId.length > 0 && serviceOrderId && serviceOrderId.length > 0) {
        const dbServiceOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceOrderId: serviceOrderId, serviceProviderId: serviceProviderId}});
        if(dbServiceOrders && dbServiceOrders.length > 0) {
          result = {code: 0, msg: "Orders fetched successfully.", orders: dbServiceOrders};
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @patch('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
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
    @param.path.string('id') id: string,
    @requestBody() serviceOrders: ServiceOrders,
  ): Promise<void> {
    await this.serviceOrdersRepository.replaceById(id, serviceOrders);
  }

  @del('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.serviceOrdersRepository.deleteById(id);
  }
}
