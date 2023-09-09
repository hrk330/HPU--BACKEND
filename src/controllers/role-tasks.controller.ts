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
import {RoleTasks} from '../models';
import {RoleTasksRepository} from '../repositories';

export class RoleTasksController {
  constructor(
    @repository(RoleTasksRepository)
    public roleTasksRepository: RoleTasksRepository,
  ) {}

  @post('/roleTasks')
  @response(200, {
    description: 'RoleTasks model instance',
    content: {'application/json': {schema: getModelSchemaRef(RoleTasks)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleTasks, {
            title: 'NewRoleTasks',
            exclude: ['roleTaskId'],
          }),
        },
      },
    })
    roleTasks: Omit<RoleTasks, 'id'>,
  ): Promise<RoleTasks> {
    return this.roleTasksRepository.create(roleTasks);
  }

  @get('/roleTasks/count')
  @response(200, {
    description: 'RoleTasks model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(RoleTasks) where?: Where<RoleTasks>,
  ): Promise<Count> {
    return this.roleTasksRepository.count(where);
  }

  @get('/roleTasks')
  @response(200, {
    description: 'Array of RoleTasks model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(RoleTasks, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(RoleTasks) filter?: Filter<RoleTasks>,
  ): Promise<RoleTasks[]> {
    return this.roleTasksRepository.find(filter);
  }

  @get('/roleTasks/{id}')
  @response(200, {
    description: 'RoleTasks model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(RoleTasks, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(RoleTasks, {exclude: 'where'})
    filter?: FilterExcludingWhere<RoleTasks>,
  ): Promise<RoleTasks> {
    return this.roleTasksRepository.findById(id, filter);
  }

  @patch('/roleTasks/{id}')
  @response(204, {
    description: 'RoleTasks PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleTasks, {partial: true}),
        },
      },
    })
    roleTasks: RoleTasks,
  ): Promise<void> {
    await this.roleTasksRepository.updateById(id, roleTasks);
  }

  @put('/roleTasks/{id}')
  @response(204, {
    description: 'RoleTasks PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() roleTasks: RoleTasks,
  ): Promise<void> {
    await this.roleTasksRepository.replaceById(id, roleTasks);
  }

  @del('/roleTasks/{id}')
  @response(204, {
    description: 'RoleTasks DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.roleTasksRepository.deleteById(id);
  }
}
