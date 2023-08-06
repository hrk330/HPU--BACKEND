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
  UserDocs,
} from '../models';
import {ServiceProviderRepository} from '../repositories';

export class ServiceProviderUserDocsController {
  constructor(
    @repository(ServiceProviderRepository) protected serviceProviderRepository: ServiceProviderRepository,
  ) { }

  @get('/service-providers/{id}/user-docs', {
    responses: {
      '200': {
        description: 'Array of ServiceProvider has many UserDocs',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserDocs)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserDocs>,
  ): Promise<UserDocs[]> {
    return this.serviceProviderRepository.userDocs(id).find(filter);
  }

  @post('/service-providers/{id}/user-docs', {
    responses: {
      '200': {
        description: 'ServiceProvider model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserDocs)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ServiceProvider.prototype.serviceProviderId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {
            title: 'NewUserDocsInServiceProvider',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userDocs: Omit<UserDocs, 'id'>,
  ): Promise<UserDocs> {
    return this.serviceProviderRepository.userDocs(id).create(userDocs);
  }

  @patch('/service-providers/{id}/user-docs', {
    responses: {
      '200': {
        description: 'ServiceProvider.UserDocs PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {partial: true}),
        },
      },
    })
    userDocs: Partial<UserDocs>,
    @param.query.object('where', getWhereSchemaFor(UserDocs)) where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.serviceProviderRepository.userDocs(id).patch(userDocs, where);
  }

  @del('/service-providers/{id}/user-docs', {
    responses: {
      '200': {
        description: 'ServiceProvider.UserDocs DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserDocs)) where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.serviceProviderRepository.userDocs(id).delete(where);
  }
}
