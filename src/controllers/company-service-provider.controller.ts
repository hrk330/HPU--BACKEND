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
import {Company, ServiceProvider} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyServiceProviderController {
  constructor(
    @repository(CompanyRepository)
    protected companyRepository: CompanyRepository,
  ) {}

  @get('/companies/{id}/service-providers', {
    responses: {
      '200': {
        description: 'Array of Company has many ServiceProvider',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(ServiceProvider)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<ServiceProvider>,
  ): Promise<ServiceProvider[]> {
    return this.companyRepository.serviceProviders(id).find(filter);
  }

  @post('/companies/{id}/service-providers', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: {
          'application/json': {schema: getModelSchemaRef(ServiceProvider)},
        },
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {
            title: 'NewServiceProviderInCompany',
            exclude: ['id'],
            optional: ['companyId'],
          }),
        },
      },
    })
    serviceProvider: Omit<ServiceProvider, 'id'>,
  ): Promise<ServiceProvider> {
    return this.companyRepository.serviceProviders(id).create(serviceProvider);
  }

  @patch('/companies/{id}/service-providers', {
    responses: {
      '200': {
        description: 'Company.ServiceProvider PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProvider, {partial: true}),
        },
      },
    })
    serviceProvider: Partial<ServiceProvider>,
    @param.query.object('where', getWhereSchemaFor(ServiceProvider))
    where?: Where<ServiceProvider>,
  ): Promise<Count> {
    return this.companyRepository
      .serviceProviders(id)
      .patch(serviceProvider, where);
  }

  @del('/companies/{id}/service-providers', {
    responses: {
      '200': {
        description: 'Company.ServiceProvider DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(ServiceProvider))
    where?: Where<ServiceProvider>,
  ): Promise<Count> {
    return this.companyRepository.serviceProviders(id).delete(where);
  }
}
