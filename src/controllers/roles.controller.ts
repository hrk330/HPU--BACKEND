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
import {Roles, RoleTasks, Tasks} from '../models';
import {RolesRepository, TasksRepository} from '../repositories';

export class RolesController {
  constructor(
    @repository(RolesRepository)
    public rolesRepository : RolesRepository,
    @repository(TasksRepository)
    public tasksRepository : TasksRepository,
  ) {}

  @post('/roles/createRoleAndTasks')
  @response(200, {
    description: 'Roles model instance',
    content: {'application/json': {schema: getModelSchemaRef(Roles)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {
            title: 'NewRoles',

          }),
        },
      },
    })
    roles: Roles,
  ): Promise<Roles> {
    let dbRole = await this.addRole(roles);
    const dbRoletasks: RoleTasks[] = await this.addRoltasks(roles.roleTasks, dbRole.roleId)
    dbRole.roleTasks = [...dbRoletasks];
    return dbRole;
  }

  async addRole(roles: Roles): Promise<Roles>{
    return await this.rolesRepository.create(roles);
  }

  async addRoltasks(roleTasks: RoleTasks[], roleId: string): Promise<RoleTasks[]>{
    roleTasks = await this.checkTasks(roleTasks);
    const dbRoletasks: RoleTasks[] = new Array<RoleTasks>;
    for(const roleTask of roleTasks){
      const dbRoleTask: RoleTasks = await this.rolesRepository.roleTasks(roleId).create(roleTask);
      dbRoletasks.push(dbRoleTask);
    }
    return dbRoletasks;
  }

  async checkTasks(roleTasks: RoleTasks[]): Promise<RoleTasks[]> {
    let tasks: string[] = new Array<string>;
    for(const roleTask of roleTasks){
      tasks.push(roleTask.taskId);
    }
    let filter: Filter<Tasks> = {where: {taskId: {inq: tasks}}, fields: ['taskId']};
    const dbTasks: Tasks[] = await this.tasksRepository.find(filter);
    for(const dbTask of dbTasks) {
      tasks = new Array<string>;
      tasks.push(dbTask.taskId);
    }
    for(const index in roleTasks){
      const taskId = roleTasks[index].taskId;
      if(tasks.indexOf(taskId) < 0) {
        roleTasks.splice(+index, 1);
      }
    }
    return roleTasks;
  }

  @get('/roles/count')
  @response(200, {
    description: 'Roles model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Roles) where?: Where<Roles>,
  ): Promise<Count> {
    return this.rolesRepository.count(where);
  }

  @get('/roles')
  @response(200, {
    description: 'Array of Roles model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Roles, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Roles) filter?: Filter<Roles>,
  ): Promise<Roles[]> {
    return this.rolesRepository.find(filter);
  }

  @patch('/roles')
  @response(200, {
    description: 'Roles PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {partial: true}),
        },
      },
    })
    roles: Roles,
    @param.where(Roles) where?: Where<Roles>,
  ): Promise<Count> {
    return this.rolesRepository.updateAll(roles, where);
  }

  @get('/roles/{id}')
  @response(200, {
    description: 'Roles model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Roles, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Roles, {exclude: 'where'}) filter?: FilterExcludingWhere<Roles>
  ): Promise<Roles> {
    return this.rolesRepository.findById(id, filter);
  }

  @patch('/roles/{id}')
  @response(204, {
    description: 'Roles PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {partial: true}),
        },
      },
    })
    roles: Roles,
  ): Promise<void> {
    await this.rolesRepository.updateById(id, roles);
  }

  @put('/roles/{id}')
  @response(204, {
    description: 'Roles PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() roles: Roles,
  ): Promise<void> {
    await this.rolesRepository.replaceById(id, roles);
  }

  @del('/roles/{id}')
  @response(204, {
    description: 'Roles DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.rolesRepository.deleteById(id);
  }
}
