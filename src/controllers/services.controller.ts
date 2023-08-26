import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
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
import {Services} from '../models';
import {ServicesRepository} from '../repositories';

export class ServicesController {
  constructor(
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
  ) {}

  @post('/services/createService')
  @response(200, {
    description: 'Services model instance',
    content: {'application/json': {schema: getModelSchemaRef(Services)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Services, {
            title: 'NewServices',
            exclude: ['serviceId'],
          }),
        },
      },
    })
    services: Omit<Services, 'serviceId'>,
  ): Promise<Services> {
    return this.servicesRepository.create(services);
  }

  @get('/services/count')
  @response(200, {
    description: 'Services model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Services) where?: Where<Services>): Promise<Count> {
    return this.servicesRepository.count(where);
  }

  @get('/services/getAllServices')
  @response(200, {
    description: 'Array of Services model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Services, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Services) filter?: Filter<Services>,
  ): Promise<Services[]> {
    return this.servicesRepository.find(filter);
  }

  @patch('/services')
  @response(200, {
    description: 'Services PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Services, {partial: true}),
        },
      },
    })
    services: Services,
    @param.where(Services) where?: Where<Services>,
  ): Promise<Count> {
    return this.servicesRepository.updateAll(services, where);
  }

  @get('/services/getService/{id}')
  @response(200, {
    description: 'Services model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Services, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Services, {exclude: 'where'})
    filter?: FilterExcludingWhere<Services>,
  ): Promise<Services> {
    return this.servicesRepository.findById(id, filter);
  }

  @patch('/services/updateService/{id}')
  @response(200, {
    description: 'Services PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Services, {partial: true}),
        },
      },
    })
    services: Services,
  ): Promise<object> {
    services.updatedAt = new Date();
    if (services.price && isNaN(services.price)) {
      services.price = 0;
    }
    if (services.pricePerKm && isNaN(+services.pricePerKm)) {
      services.pricePerKm = 0;
    }
    if (services.salesTax && isNaN(+services.salesTax)) {
      services.salesTax = 0;
    }

    await this.servicesRepository.updateById(id, services);
    return {
      success: {
        code: 0,
        msg: 'Record updated successfully.',
        service: await this.servicesRepository.findById(id, {}),
      },
    };
  }

  @put('/services/{id}')
  @response(204, {
    description: 'Services PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() services: Services,
  ): Promise<void> {
    await this.servicesRepository.replaceById(id, services);
  }

  @del('/services/{id}')
  @response(204, {
    description: 'Services DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.servicesRepository.deleteById(id);
  }
}
