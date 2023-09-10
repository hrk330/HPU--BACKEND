import {TokenService} from '@loopback/authentication';
import {MyUserService, TokenServiceBindings, UserServiceBindings} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {get, getModelSchemaRef, param, patch, post, put, requestBody, response} from '@loopback/rest';
import {genSalt, hash} from 'bcryptjs';
import _ from 'lodash';
import {AdminUsers, CredentialsRequest, CredentialsRequestBody, Roles, Tasks, UserCreds, UserTasks} from '../models';
import {AdminUsersRepository, RolesRepository, TasksRepository} from '../repositories';

export class AdminUsersController {
  constructor(
    @repository(AdminUsersRepository)
    public adminUsersRepository: AdminUsersRepository,
    @repository(TasksRepository)
    public tasksRepository: TasksRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(UserServiceBindings.USER_SERVICE)
    public userService: MyUserService,
    @repository(RolesRepository)
    public rolesRepository: RolesRepository,
  ) {}

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
    const result = {
      code: 5,
      msg: 'Invalid email or password.',
      token: '',
      user: {},
    };
    try {
      const filter = {
        where: {email: credentials.email},
        include: [{relation: 'userCreds'}],
      };
      const user = await this.adminUsersRepository.findOne(filter);
      if(user?.status !== "S") {
        if (user?.userCreds) {
          const salt = user.userCreds.salt;
          const password = await hash(credentials.password, salt);
          if (password === user.userCreds.password) {
            user.userCreds = new UserCreds();
            result.token = await this.jwtService.generateToken(
              this.userService.convertToUserProfile(user),
            );
            result.user = user;
            result.code = 0;
            result.msg = 'User logged in successfully.';
          }
        }
      } else {
        result.msg = "User suspended";
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
    const result = {code: 5, msg: '', adminUser: {}};
    if (!(await this.checkAdminUserExists(adminUsers.email))) {
      if (await this.checkIfValidRole(adminUsers.roleId)) {
        const userTasks: UserTasks[] = adminUsers.userTasksList;
        adminUsers.userTasksList = [];
        const dbAdminUser = await this.adminUsersRepository.create(
          _.omit(adminUsers, 'password'),
        );
        if (dbAdminUser) {
          const salt = await genSalt();
          const password = await hash(adminUsers.password, salt);
          await this.adminUsersRepository
            .userCreds(dbAdminUser.id)
            .create({password, salt});
          const dbUserTasks: UserTasks[] = await this.addUserTasks(
            userTasks,
            dbAdminUser.id,
          );
          dbAdminUser.userTasks = [...dbUserTasks];
          result.adminUser = dbAdminUser;
          result.code = 0;
          result.msg = 'User and tasks created successfully.';
        }
      } else {
        result.msg = 'Invalid role.';
      }
    } else {
      result.msg = 'User already exists.';
    }
    return result;
  }

  async checkIfValidRole(roleId: string): Promise<boolean> {
    let result = false;
    try {
      const dbRole: Roles = await this.rolesRepository.findById(roleId);
      if (dbRole) {
        result = true;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async checkAdminUserExists(email: string): Promise<boolean> {
    let result = true;
    try {
      const adminUsers: AdminUsers[] = await this.adminUsersRepository.find({
        where: {email: email},
      });
      if (adminUsers && adminUsers.length < 1) {
        result = false;
      }
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  async addUserTasks(
    userTasks: UserTasks[],
    adminUsersId: string,
  ): Promise<UserTasks[]> {
    const dbUserTasks: UserTasks[] = [];
    if (Array.isArray(userTasks) && userTasks.length > 0) {
      userTasks = await this.checkTasks(userTasks, adminUsersId);
      for (const userTask of userTasks) {
        const dbRoleTask: UserTasks = await this.adminUsersRepository
          .userTasks(adminUsersId)
          .create(userTask);
        dbUserTasks.push(dbRoleTask);
      }
    }
    return dbUserTasks;
  }

  async checkTasks(
    userTasks: UserTasks[],
    adminUsersId: string,
  ): Promise<UserTasks[]> {
    let tasks: string[] = [];
    for (const userTask of userTasks) {
      tasks.push(userTask.taskId);
    }
    const dbTasks: Tasks[] = await this.tasksRepository.find({
      where: {taskId: {inq: tasks}},
      fields: ['taskId'],
    });
    tasks = [];
    for (const dbTask of dbTasks) {
      tasks.push(dbTask.taskId);
    }

    for (let index = 0; index < userTasks.length; ) {
      const taskId = userTasks[index].taskId;
      if (tasks.indexOf(taskId) < 0) {
        userTasks.splice(+index, 1);
      } else {
        index++;
      }
    }

    const dbUsertasks = await this.adminUsersRepository
      .userTasks(adminUsersId)
      .find({fields: ['userTaskId', 'taskId']});
    for (const dbUsertask of dbUsertasks) {
      for (const userTask of userTasks) {
        if (dbUsertask.taskId === userTask.taskId) {
          userTask.userTaskId = dbUsertask.userTaskId;
        }
      }
    }
    return userTasks;
  }

  async updateUserTasks(
    userTasks: UserTasks[],
    adminUsersId: string,
  ): Promise<void> {
    if (Array.isArray(userTasks) && userTasks.length > 0) {
      userTasks = await this.checkTasks(userTasks, adminUsersId);
      for (const userTask of userTasks) {
        if (userTask.userTaskId !== undefined) {
          userTask.updatedAt = new Date();
          await this.adminUsersRepository
            .userTasks(adminUsersId)
            .patch(
              _.pick(userTask, [
                'isViewAllowed',
                'isUpdateAllowed',
                'isDeleteAllowed',
                'isCreateAllowed',
                'updatedAt',
              ]),
              {
                userTaskId: userTask.userTaskId,
                adminUsersId: userTask.adminUsersId,
                taskId: userTask.taskId,
              },
            );
        } else {
          await this.adminUsersRepository
            .userTasks(adminUsersId)
            .create(userTask);
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
    const result = {code: 5, msg: 'User not available', adminUser: {}};
    const dbAdminUser = await this.adminUsersRepository.findOne(
      {where: {id: adminUsers.id}, include: [{relation: 'userCreds'}],},
    );
    if (dbAdminUser) {
      adminUsers.userTasksList = [];
      adminUsers.updatedAt = new Date();
      if (await this.checkIfValidRole(adminUsers.roleId)) {
        if(adminUsers.password?.length>0) {
          const salt = await genSalt();
          const password = await hash(adminUsers.password, salt);
          await this.adminUsersRepository
            .userCreds(dbAdminUser.id)
            .patch({password, salt});
        }
        await this.adminUsersRepository.updateById(adminUsers.id, _.omit(adminUsers, 'password'));
        result.adminUser = await this.adminUsersRepository.findById(
          adminUsers.id,
        );
        result.code = 0;
        result.msg = 'Record updated successfully.';
      } else {
        result.msg = 'Invalid role';
      }
    }
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

  @get('/adminUsers/getAllAdminUsers')
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
    const dbAdminUsers: AdminUsers[] = await this.adminUsersRepository.find({});
    const userRolesList = [];

    for (const adminUser of dbAdminUsers) {
      userRolesList.push(adminUser.roleId);
    }

    const dbRoles: Roles[] = await this.rolesRepository.find({
      where: {roleId: {inq: userRolesList}},
    });
    const rolesMap = new Map<string, Roles>();

    for (const role of dbRoles) {
      rolesMap.set(role.roleId, role);
    }

    for (let index = 0; index < dbAdminUsers.length; ) {
      const role: Roles | undefined = rolesMap.get(
        dbAdminUsers[index].roleId + '',
      );
      dbAdminUsers[index].roleName = role?.roleName;
      ++index;
    }

    return dbAdminUsers;
  }

  @get('/adminUsers/getAdminUser/{id}')
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
    @param.filter(AdminUsers, {exclude: 'where'})
    filter?: FilterExcludingWhere<AdminUsers>,
  ): Promise<AdminUsers> {
    const adminUser = await this.adminUsersRepository.findById(id, {});
    const dbUsertasks: UserTasks[] = await this.adminUsersRepository
      .userTasks(adminUser.id)
      .find({});
    adminUser.userTasks = [...dbUsertasks];
    return adminUser;
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

  // @del('/adminUsers/deleteAdminUser/{id}')
  // @response(204, {
  //   description: 'AdminUsers DELETE success',
  // })
  // async deleteById(@param.path.string('id') id: string): Promise<void> {
  //   this.adminUsersRepository.userTasks(id).delete({});
  //   this.adminUsersRepository.userCreds(id).delete({});
  //   this.adminUsersRepository.deleteById(id);
  // }
}
