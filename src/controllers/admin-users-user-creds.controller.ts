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
import {AdminUsers, UserCreds} from '../models';
import {AdminUsersRepository} from '../repositories';

export class AdminUsersUserCredsController {
  constructor(
    @repository(AdminUsersRepository)
    protected adminUsersRepository: AdminUsersRepository,
  ) {}

  @get('/admin-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AdminUsers has one UserCreds',
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
    return this.adminUsersRepository.userCreds(id).get(filter);
  }

  @post('/admin-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AdminUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCreds)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AdminUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {
            title: 'NewUserCredsInAdminUsers',
            exclude: ['id'],
            optional: ['id'],
          }),
        },
      },
    })
    userCreds: Omit<UserCreds, 'id'>,
  ): Promise<UserCreds> {
    return this.adminUsersRepository.userCreds(id).create(userCreds);
  }

  @patch('/admin-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AdminUsers.UserCreds PATCH success count',
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
    return this.adminUsersRepository.userCreds(id).patch(userCreds, where);
  }

  @del('/admin-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AdminUsers.UserCreds DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCreds))
    where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.adminUsersRepository.userCreds(id).delete(where);
  }
}
