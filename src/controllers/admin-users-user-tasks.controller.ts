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
  AdminUsers,
  UserTasks,
} from '../models';
import {AdminUsersRepository} from '../repositories';

export class AdminUsersUserTasksController {
  constructor(
    @repository(AdminUsersRepository) protected adminUsersRepository: AdminUsersRepository,
  ) { }

  @get('/admin-users/{id}/user-tasks', {
    responses: {
      '200': {
        description: 'Array of AdminUsers has many UserTasks',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserTasks)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserTasks>,
  ): Promise<UserTasks[]> {
    return this.adminUsersRepository.userTasks(id).find(filter);
  }

  @post('/admin-users/{id}/user-tasks', {
    responses: {
      '200': {
        description: 'AdminUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserTasks)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AdminUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTasks, {
            title: 'NewUserTasksInAdminUsers',
            exclude: ['userTaskId'],
            optional: ['adminUsersId']
          }),
        },
      },
    }) userTasks: Omit<UserTasks, 'userTaskId'>,
  ): Promise<UserTasks> {
    return this.adminUsersRepository.userTasks(id).create(userTasks);
  }

  @patch('/admin-users/{id}/user-tasks', {
    responses: {
      '200': {
        description: 'AdminUsers.UserTasks PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTasks, {partial: true}),
        },
      },
    })
    userTasks: Partial<UserTasks>,
    @param.query.object('where', getWhereSchemaFor(UserTasks)) where?: Where<UserTasks>,
  ): Promise<Count> {
    return this.adminUsersRepository.userTasks(id).patch(userTasks, where);
  }

  @del('/admin-users/{id}/user-tasks', {
    responses: {
      '200': {
        description: 'AdminUsers.UserTasks DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserTasks)) where?: Where<UserTasks>,
  ): Promise<Count> {
    return this.adminUsersRepository.userTasks(id).delete(where);
  }
}
