import {TokenService} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  Where,
  repository,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {AdminUsers, CredentialsRequest, CredentialsRequestBody, Tasks, UserCreds, UserTasks} from '../models';
import {AdminUsersRepository, AppUsersRepository, TasksRepository} from '../repositories';

export class AdminUsersController {
  constructor(
    @repository(AdminUsersRepository)
    public adminUsersRepository: AdminUsersRepository,
    @repository(TasksRepository)
    public tasksRepository: TasksRepository,
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
  ) { }


  @post('/adminUsers/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody(CredentialsRequestBody) credentials: CredentialsRequest,
  ): Promise<String> {
    // ensure the user exists, and the password is correct
    let result = {code: 5, msg: "Invalid email or password.", token: '', user: {}};
    try {
      const filter = {where: {email: credentials.email}, include: [{'relation': 'userCreds'}]};
      const user = await this.adminUsersRepository.findOne(filter);

      //const user = await this.userService.verifyCredentials(credentials);
      if (user && user.userCreds) {
        const salt = user.userCreds.salt;
        const password = await hash(credentials.password, salt);
        if (password === user.userCreds.password) {

          //this.appUsersRepository.updateById(id, appUsers)
          // convert a User object into a UserProfile object (reduced set of properties)

          // create a JSON Web Token based on the user profile
          result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
          user.userCreds = new UserCreds();
          result.user = user;
          result.code = 0;
          result.msg = "User logged in successfully.";
        }
      }
    } catch (e) {
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @post('/adminUsers/createAdminUser')
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
            exclude: ['id'],
          }),
        },
      },
    })
    adminUsers: Omit<AdminUsers, 'id'>,
  ): Promise<Object> {
    let result = {code: 5, msg: "", adminUser: {}};
    if (!await this.checkAdminUserExists(adminUsers.email)) {
      const userTasks: UserTasks[] = adminUsers.userTasksList;
      adminUsers.userTasksList = new Array<UserTasks>;
      adminUsers.roleId = "ADMINUSER";
      const dbAdminUser = await this.adminUsersRepository.create(_.omit(adminUsers, 'password'));
      if (dbAdminUser) {
        const salt = await genSalt();
        const password = await hash(adminUsers.password, salt);
        await this.adminUsersRepository.userCreds(dbAdminUser.id).create({password, salt});
        const dbUserTasks: UserTasks[] = await this.addUserTasks(userTasks, dbAdminUser.id)
        dbAdminUser.userTasks = [...dbUserTasks];
        result.adminUser = dbAdminUser;
        result.code = 0;
        result.msg = "User and tasks created successfully.";
      }

    } else {
      result.msg = "User already exists.";
    }
    return result;
  }

  async checkAdminUserExists(email: string): Promise<boolean> {
    let result: boolean = true;
    try {
      const adminUsers: AdminUsers[] = await this.adminUsersRepository.find({where: {email: email}});
      if (adminUsers && adminUsers.length < 1) {
        result = false;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async addUserTasks(userTasks: UserTasks[], adminUsersId: string): Promise<UserTasks[]> {
    const dbUserTasks: UserTasks[] = new Array<UserTasks>;
    if (Array.isArray(userTasks) && userTasks.length > 0) {
      userTasks = await this.checkTasks(userTasks);
      for (const userTask of userTasks) {
        const dbRoleTask: UserTasks = await this.adminUsersRepository.userTasks(adminUsersId).create(userTask);
        dbUserTasks.push(dbRoleTask);
      }
    }
    return dbUserTasks;
  }

  async checkTasks(userTasks: UserTasks[]): Promise<UserTasks[]> {
    let tasks: string[] = new Array<string>;
    for (const userTask of userTasks) {
      tasks.push(userTask.taskId);
    }
    const dbTasks: Tasks[] = await this.tasksRepository.find({where: {taskId: {inq: tasks}}, fields: ['taskId']});
    console.log(dbTasks);
    tasks = new Array<string>;
    for (const dbTask of dbTasks) {
      tasks.push(dbTask.taskId);
    }

    for (let index = 0; index < userTasks.length;) {
      const taskId = userTasks[index].taskId;
      if (tasks.indexOf(taskId) < 0) {
        userTasks.splice(+index, 1);
      } else {
        index++;
      }
    }
    return userTasks;
  }

  async updateUserTasks(userTasks: UserTasks[], adminUsersId: string): Promise<void> {
    if (Array.isArray(userTasks) && userTasks.length > 0) {
      userTasks = await this.checkTasks(userTasks);
      for (const userTask of userTasks) {
        if (userTask.userTaskId !== undefined) {
          userTask.updatedAt = new Date();
          await this.adminUsersRepository.userTasks(adminUsersId).patch(_.pick(userTask, ['isViewAllowed', 'isUpdateAllowed', 'isDeleteAllowed', 'isCreateAllowed', 'updatedAt']), {taskId: userTask.userTaskId});
        } else {
          await this.adminUsersRepository.userTasks(adminUsersId).create(userTask);
        }
      }
    }
  }

  @post('/adminUsers/updateAdminUser')
  @response(200, {
    description: 'Roles PATCH success',
  })
  async updateAdminUser(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(AdminUsers, {partial: true}),
        },
      },
    })
    adminUsers: AdminUsers,
  ): Promise<Object> {
    let result = {code: 5, msg: "", adminUser: {}};

    const userTasks: UserTasks[] = adminUsers.userTasksList;
      adminUsers.userTasksList = new Array<UserTasks>;
    await this.adminUsersRepository.updateById(adminUsers.id, adminUsers);
    const dbAdminUser = await this.adminUsersRepository.findById(adminUsers.id, {});
    await this.updateUserTasks(userTasks, dbAdminUser.id);
    const dbUsertasks = await this.adminUsersRepository.userTasks(dbAdminUser.id).find({});
    dbAdminUser.userTasks = [...dbUsertasks];
    result.adminUser = dbAdminUser;
    result.code = 0;
    result.msg = "Record updated successfully.";

    return result;
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
