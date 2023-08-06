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
  Account,
} from '../models';
import {ServiceProviderRepository} from '../repositories';

export class ServiceProviderAccountController {
  constructor(
    @repository(ServiceProviderRepository) protected serviceProviderRepository: ServiceProviderRepository,
  ) { }

  @get('/service-providers/{id}/account', {
    responses: {
      '200': {
        description: 'ServiceProvider has one Account',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Account),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Account>,
  ): Promise<Account> {
    return this.serviceProviderRepository.account(id).get(filter);
  }

  @post('/service-providers/{id}/account', {
    responses: {
      '200': {
        description: 'ServiceProvider model instance',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ServiceProvider.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccountInServiceProvider',
            exclude: ['accountId'],
            optional: ['userId']
          }),
        },
      },
    }) account: Omit<Account, 'accountId'>,
  ): Promise<Account> {
    return this.serviceProviderRepository.account(id).create(account);
  }

  @patch('/service-providers/{id}/account', {
    responses: {
      '200': {
        description: 'ServiceProvider.Account PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Partial<Account>,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.serviceProviderRepository.account(id).patch(account, where);
  }

  @del('/service-providers/{id}/account', {
    responses: {
      '200': {
        description: 'ServiceProvider.Account DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Account)) where?: Where<Account>,
  ): Promise<Count> {
    return this.serviceProviderRepository.account(id).delete(where);
  }
}
