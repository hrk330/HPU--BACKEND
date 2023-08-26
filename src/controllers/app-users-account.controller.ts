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
import {AppUsers, Account} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersAccountController {
  constructor(
    @repository(AppUsersRepository)
    protected appUsersRepository: AppUsersRepository,
  ) {}

  @get('/app-users/{id}/account', {
    responses: {
      '200': {
        description: 'AppUsers has one Account',
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
    return this.appUsersRepository.account(id).get(filter);
  }

  @post('/app-users/{id}/account', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(Account)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccountInAppUsers',
            exclude: ['accountId'],
            optional: ['userId'],
          }),
        },
      },
    })
    account: Omit<Account, 'accountId'>,
  ): Promise<Account> {
    return this.appUsersRepository.account(id).create(account);
  }

  @patch('/app-users/{id}/account', {
    responses: {
      '200': {
        description: 'AppUsers.Account PATCH success count',
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
    @param.query.object('where', getWhereSchemaFor(Account))
    where?: Where<Account>,
  ): Promise<Count> {
    return this.appUsersRepository.account(id).patch(account, where);
  }

  @del('/app-users/{id}/account', {
    responses: {
      '200': {
        description: 'AppUsers.Account DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Account))
    where?: Where<Account>,
  ): Promise<Count> {
    return this.appUsersRepository.account(id).delete(where);
  }
}
