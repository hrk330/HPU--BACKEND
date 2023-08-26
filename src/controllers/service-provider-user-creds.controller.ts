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
import {ServiceProvider, UserCreds} from '../models';
import {ServiceProviderRepository} from '../repositories';

export class ServiceProviderUserCredsController {
  constructor(
    @repository(ServiceProviderRepository)
    protected serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @get('/service-providers/{id}/user-creds', {
    responses: {
      '200': {
        description: 'ServiceProvider has one UserCreds',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCreds),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCreds>,
  ): Promise<UserCreds> {
    return this.serviceProviderRepository.userCreds(id).get(filter);
  }

  @post('/service-providers/{id}/user-creds', {
    responses: {
      '200': {
        description: 'ServiceProvider model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCreds)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ServiceProvider.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {
            title: 'NewUserCredsInServiceProvider',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userCreds: Omit<UserCreds, 'id'>,
  ): Promise<UserCreds> {
    return this.serviceProviderRepository.userCreds(id).create(userCreds);
  }

  @patch('/service-providers/{id}/user-creds', {
    responses: {
      '200': {
        description: 'ServiceProvider.UserCreds PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {partial: true}),
        },
      },
    })
    userCreds: Partial<UserCreds>,
    @param.query.object('where', getWhereSchemaFor(UserCreds))
    where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.serviceProviderRepository.userCreds(id).patch(userCreds, where);
  }

  @del('/service-providers/{id}/user-creds', {
    responses: {
      '200': {
        description: 'ServiceProvider.UserCreds DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCreds))
    where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.serviceProviderRepository.userCreds(id).delete(where);
  }
}
