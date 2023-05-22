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
import {AdminUsers, UserTasks, Tasks} from '../models';
import {AdminUsersRepository, TasksRepository} from '../repositories';

export class AdminUsersController {
  constructor(
    @repository(AdminUsersRepository)
    public adminUsersRepository : AdminUsersRepository,
    @repository(TasksRepository)
    public tasksRepository : TasksRepository,
  ) {}

  @post('/adminUsers')
  @response(200, {
    description: 'AdminUsers model instance',
    content: {'application/json': {schema: getModelSchemaRef(AdminUsers)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdminUsers, {
            title: 'NewAdminUsers',
            exclude: ['adminUsersId'],
          }),
        },
      },
    })
    adminUsers: Omit<AdminUsers, 'adminUsersId'>,
  ): Promise<Object> {
    let result = {code: 5, msg: "", adminUser: {}};
    if (!await this.checkAdminUserExists(adminUsers.email)) {
      const userTasks: UserTasks[] = adminUsers.userTasksList;
      adminUsers.userTasksList = new Array<UserTasks>;
      let dbAdminUser = await this.adminUsersRepository.create(adminUsers);
      const dbUserTasks: UserTasks[] = await this.addUserTasks(userTasks, dbAdminUser.adminUsersId)
      dbAdminUser.userTasks = [...dbUserTasks];
      result.adminUser = dbAdminUser;
      result.code = 0;
      result.msg = "User and tasks created successfully.";
    } else {
      result.msg = "User already exists.";
    }
    return result;
  }

  async checkAdminUserExists(email: string): Promise<boolean> {
    let result: boolean = true;
    try {
      const adminUsers: AdminUsers[] = await this.find({where: {email: email}});
      if (adminUsers.length < 1) {
        result = false;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async addUserTasks(userTasks: UserTasks[], adminUsersId: string): Promise<UserTasks[]>{
    const dbUserTasks: UserTasks[] = new Array<UserTasks>;
    if(Array.isArray(userTasks) && userTasks.length > 0) {
      userTasks = await this.checkTasks(userTasks);
      for(const userTask of userTasks){
        const dbRoleTask: UserTasks = await this.adminUsersRepository.userTasks(adminUsersId).create(userTask);
        dbUserTasks.push(dbRoleTask);
      }
    }
    return dbUserTasks;
  }

  async checkTasks(userTasks: UserTasks[]): Promise<UserTasks[]> {
    let tasks: string[] = new Array<string>;
    for(const userTask of userTasks){
      tasks.push(userTask.taskId);
    }
    const dbTasks: Tasks[] = await this.tasksRepository.find({where: {taskId: {inq: tasks}}, fields: ['taskId']});
    for(const dbTask of dbTasks) {
      tasks = new Array<string>;
      tasks.push(dbTask.taskId);
    }
    
    for(let index = 0; index < userTasks.length;){
      const taskId = userTasks[index].taskId;
      if(tasks.indexOf(taskId) < 0) {
        userTasks.splice(+index, 1);
      } else {
        index++;
      }
    }
    return userTasks;
  }

  @get('/adminUsers/count')
  @response(200, {
    description: 'AdminUsers model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(AdminUsers) where?: Where<AdminUsers>,
  ): Promise<Count> {
    return this.adminUsersRepository.count(where);
  }

  @get('/adminUsers')
  @response(200, {
    description: 'Array of AdminUsers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AdminUsers, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(AdminUsers) filter?: Filter<AdminUsers>,
  ): Promise<AdminUsers[]> {
    return this.adminUsersRepository.find(filter);
  }

  @patch('/adminUsers')
  @response(200, {
    description: 'AdminUsers PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdminUsers, {partial: true}),
        },
      },
    })
    adminUsers: AdminUsers,
    @param.where(AdminUsers) where?: Where<AdminUsers>,
  ): Promise<Count> {
    return this.adminUsersRepository.updateAll(adminUsers, where);
  }

  @get('/adminUsers/{id}')
  @response(200, {
    description: 'AdminUsers model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(AdminUsers, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(AdminUsers, {exclude: 'where'}) filter?: FilterExcludingWhere<AdminUsers>
  ): Promise<AdminUsers> {
    return this.adminUsersRepository.findById(id, filter);
  }

  @patch('/adminUsers/{id}')
  @response(204, {
    description: 'AdminUsers PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdminUsers, {partial: true}),
        },
      },
    })
    adminUsers: AdminUsers,
  ): Promise<void> {
    await this.adminUsersRepository.updateById(id, adminUsers);
  }

  @put('/adminUsers/{id}')
  @response(204, {
    description: 'AdminUsers PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() adminUsers: AdminUsers,
  ): Promise<void> {
    await this.adminUsersRepository.replaceById(id, adminUsers);
  }

  @del('/adminUsers/{id}')
  @response(204, {
    description: 'AdminUsers DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.adminUsersRepository.deleteById(id);
  }
}
