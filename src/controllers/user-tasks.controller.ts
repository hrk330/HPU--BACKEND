import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserTasks} from '../models';
import {UserTasksRepository} from '../repositories';

export class UserTasksController {
  constructor(
    @repository(UserTasksRepository)
    public userTasksRepository: UserTasksRepository,
  ) {}

  @post('/userTasks')
  @response(200, {
    description: 'UserTasks model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserTasks)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTasks, {
            title: 'NewUserTasks',
            exclude: ['userTaskId'],
          }),
        },
      },
    })
    userTasks: Omit<UserTasks, 'userTaskId'>,
  ): Promise<UserTasks> {
    return this.userTasksRepository.create(userTasks);
  }

  @get('/userTasks/count')
  @response(200, {
    description: 'UserTasks model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserTasks) where?: Where<UserTasks>,
  ): Promise<Count> {
    return this.userTasksRepository.count(where);
  }

  @get('/userTasks')
  @response(200, {
    description: 'Array of UserTasks model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserTasks, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserTasks) filter?: Filter<UserTasks>,
  ): Promise<UserTasks[]> {
    return this.userTasksRepository.find(filter);
  }

  @get('/userTasks/{id}')
  @response(200, {
    description: 'UserTasks model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserTasks, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserTasks, {exclude: 'where'})
    filter?: FilterExcludingWhere<UserTasks>,
  ): Promise<UserTasks> {
    return this.userTasksRepository.findById(id, filter);
  }

  @patch('/userTasks/{id}')
  @response(204, {
    description: 'UserTasks PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserTasks, {partial: true}),
        },
      },
    })
    userTasks: UserTasks,
  ): Promise<void> {
    await this.userTasksRepository.updateById(id, userTasks);
  }

  @put('/userTasks/{id}')
  @response(204, {
    description: 'UserTasks PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userTasks: UserTasks,
  ): Promise<void> {
    await this.userTasksRepository.replaceById(id, userTasks);
  }

  @del('/userTasks/{id}')
  @response(204, {
    description: 'UserTasks DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userTasksRepository.deleteById(id);
  }
}
