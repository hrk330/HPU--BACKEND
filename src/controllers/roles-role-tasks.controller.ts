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
import {Roles, RoleTasks} from '../models';
import {RolesRepository} from '../repositories';

export class RolesRoleTasksController {
  constructor(
    @repository(RolesRepository) protected rolesRepository: RolesRepository,
  ) {}

  @get('/roles/{id}/role-tasks', {
    responses: {
      '200': {
        description: 'Array of Roles has many RoleTasks',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(RoleTasks)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<RoleTasks>,
  ): Promise<RoleTasks[]> {
    return this.rolesRepository.roleTasks(id).find(filter);
  }

  @post('/roles/{id}/role-tasks', {
    responses: {
      '200': {
        description: 'Roles model instance',
        content: {'application/json': {schema: getModelSchemaRef(RoleTasks)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Roles.prototype.roleId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleTasks, {
            title: 'NewRoleTasksInRoles',
            exclude: ['roleTaskId'],
            optional: ['roleId'],
          }),
        },
      },
    })
    roleTasks: Omit<RoleTasks, 'roleTaskId'>,
  ): Promise<RoleTasks> {
    return this.rolesRepository.roleTasks(id).create(roleTasks);
  }

  @patch('/roles/{id}/role-tasks', {
    responses: {
      '200': {
        description: 'Roles.RoleTasks PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(RoleTasks, {partial: true}),
        },
      },
    })
    roleTasks: Partial<RoleTasks>,
    @param.query.object('where', getWhereSchemaFor(RoleTasks))
    where?: Where<RoleTasks>,
  ): Promise<Count> {
    return this.rolesRepository.roleTasks(id).patch(roleTasks, where);
  }

  @del('/roles/{id}/role-tasks', {
    responses: {
      '200': {
        description: 'Roles.RoleTasks DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(RoleTasks))
    where?: Where<RoleTasks>,
  ): Promise<Count> {
    return this.rolesRepository.roleTasks(id).delete(where);
  }
}
