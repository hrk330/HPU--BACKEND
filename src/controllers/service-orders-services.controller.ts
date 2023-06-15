import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  ServiceOrders,
  Services,
} from '../models';
import {ServiceOrdersRepository} from '../repositories';

export class ServiceOrdersServicesController {
  constructor(
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
  ) { }

  @get('/service-orders/{id}/services', {
    responses: {
      '200': {
        description: 'Services belonging to ServiceOrders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Services)},
          },
        },
      },
    },
  })
  async getServices(
    @param.path.string('id') id: typeof ServiceOrders.prototype.serviceOrderId,
  ): Promise<Services> {
    return this.serviceOrdersRepository.service(id);
  }
}
