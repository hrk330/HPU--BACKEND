import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import _ from 'lodash';
import {Roles, RoleTasks, Tasks} from '../models';
import {RolesRepository, TasksRepository} from '../repositories';

export class RolesController {
  constructor(
    @repository(RolesRepository)
    public rolesRepository: RolesRepository,
    @repository(TasksRepository)
    public tasksRepository: TasksRepository,
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
  ): Promise<Object> {
    const result = {code: 5, msg: '', role: {}};
    if (!(await this.checkRoleExists('', roles.roleName))) {
      const roleTasks: RoleTasks[] = roles.roleTasks;
      roles.roleTasks = [];
      const dbRole = await this.addRole(roles);
      const dbRoletasks: RoleTasks[] = await this.addRoleTasks(
        roleTasks,
        dbRole.roleId,
      );
      dbRole.roleTasks = [...dbRoletasks];
      result.role = dbRole;
      result.code = 0;
      result.msg = 'Role and tasks created successfully.';
    } else {
      result.msg = 'Role already exists.';
    }
    return result;
  }

  async checkRoleExists(roleId: string, roleName: string): Promise<boolean> {
    let result = true;
    try {
      const dbRoles: Roles[] = await this.rolesRepository.find({
        where: {roleName: roleName},
      });
      if (
        dbRoles.length < 1 ||
        (dbRoles.length < 2 && dbRoles[0].roleId === roleId)
      ) {
        result = false;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async addRole(roles: Roles): Promise<Roles> {
    return this.rolesRepository.create(roles);
  }

  async addRoleTasks(
    roleTasks: RoleTasks[],
    roleId: string,
  ): Promise<RoleTasks[]> {
    const dbRoletasks: RoleTasks[] = [];
    if (Array.isArray(roleTasks) && roleTasks.length > 0) {
      roleTasks = await this.checkTasks(roleTasks);
      for (const roleTask of roleTasks) {
        const dbRoleTask: RoleTasks = await this.rolesRepository
          .roleTasks(roleId)
          .create(roleTask);
        dbRoletasks.push(dbRoleTask);
      }
    }
    return dbRoletasks;
  }

  async updateRoleTasks(roleTasks: RoleTasks[], roleId: string): Promise<void> {
    if (Array.isArray(roleTasks) && roleTasks.length > 0) {
      roleTasks = await this.checkTasks(roleTasks);
      for (const roleTask of roleTasks) {
        if (roleTask.roleTaskId !== undefined) {
          roleTask.updatedAt = new Date();
          await this.rolesRepository
            .roleTasks(roleId)
            .patch(
              _.pick(roleTask, [
                'isViewAllowed',
                'isUpdateAllowed',
                'isDeleteAllowed',
                'isCreateAllowed',
                'updatedAt',
              ]),
              {taskId: roleTask.taskId},
            );
        } else {
          await this.rolesRepository.roleTasks(roleId).create(roleTask);
        }
      }
    }
  }

  async checkTasks(roleTasks: RoleTasks[]): Promise<RoleTasks[]> {
    let tasks: string[] = [];
    for (const roleTask of roleTasks) {
      tasks.push(roleTask.taskId);
    }
    const dbTasks: Tasks[] = await this.tasksRepository.find({
      where: {taskId: {inq: tasks}},
      fields: ['taskId'],
    });
    tasks = [];
    for (const dbTask of dbTasks) {
      tasks.push(dbTask.taskId);
    }

    for (let index = 0; index < roleTasks.length; ) {
      const taskId = roleTasks[index].taskId;
      if (tasks.indexOf(taskId) < 0) {
        roleTasks.splice(+index, 1);
      } else {
        index++;
      }
    }
    return roleTasks;
  }

  @get('/roles/count')
  @response(200, {
    description: 'Roles model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Roles) where?: Where<Roles>): Promise<Count> {
    return this.rolesRepository.count(where);
  }

  @get('/roles/getRoles')
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
  async find(@param.filter(Roles) filter?: Filter<Roles>): Promise<Roles[]> {
    return this.rolesRepository.find({
      fields: ['roleId', 'roleName', 'isActive'],
    });
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
    @param.filter(Roles, {exclude: 'where'})
    filter?: FilterExcludingWhere<Roles>,
  ): Promise<Roles> {
    return this.rolesRepository.findById(id, {include: ['roleTasks']});
  }

  @post('/roles/updateRoles')
  @response(200, {
    description: 'Roles PATCH success',
  })
  async updateById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Roles, {partial: true}),
        },
      },
    })
    roles: Roles,
  ): Promise<Object> {
    const result = {code: 5, msg: '', role: {}};
    if (!(await this.checkRoleExists(roles.roleId, roles.roleName))) {
      const roleTasks: RoleTasks[] = roles.roleTasks;
      roles.roleTasks = [];
      await this.rolesRepository.updateById(
        roles.roleId,
        _.pick(roles, ['roleName', 'isActive']),
      );
      const dbRole = await this.findById(roles.roleId);
      await this.updateRoleTasks(roleTasks, roles.roleId);
      const dbRoletasks = await this.rolesRepository
        .roleTasks(roles.roleId)
        .find({});
      dbRole.roleTasks = [...dbRoletasks];
      result.role = dbRole;
      result.code = 0;
      result.msg = 'Record updated successfully.';
    } else {
      result.msg = 'Duplicate role name.';
    }
    return result;
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
