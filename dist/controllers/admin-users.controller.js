"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsersController = void 0;
const tslib_1 = require("tslib");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const bcryptjs_1 = require("bcryptjs");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let AdminUsersController = class AdminUsersController {
    constructor(adminUsersRepository, tasksRepository, jwtService, userService, rolesRepository) {
        this.adminUsersRepository = adminUsersRepository;
        this.tasksRepository = tasksRepository;
        this.jwtService = jwtService;
        this.userService = userService;
        this.rolesRepository = rolesRepository;
    }
    async login(credentials) {
        // ensure the user exists, and the password is correct
        const result = {
            code: 5,
            msg: 'Invalid email or password.',
            token: '',
            user: {},
        };
        try {
            const filter = {
                where: { email: credentials.email },
                include: [{ relation: 'userCreds' }],
            };
            const user = await this.adminUsersRepository.findOne(filter);
            if ((user === null || user === void 0 ? void 0 : user.status) !== "S") {
                if (user === null || user === void 0 ? void 0 : user.userCreds) {
                    const salt = user.userCreds.salt;
                    const password = await (0, bcryptjs_1.hash)(credentials.password, salt);
                    if (password === user.userCreds.password) {
                        user.userCreds = new models_1.UserCreds();
                        result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
                        result.user = user;
                        result.code = 0;
                        result.msg = 'User logged in successfully.';
                    }
                }
            }
            else {
                result.msg = "User suspended";
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = "Some error occurred";
        }
        return JSON.stringify(result);
    }
    async create(adminUsers) {
        const result = { code: 5, msg: '', adminUser: {} };
        if (!(await this.checkAdminUserExists(adminUsers.email))) {
            if (await this.checkIfValidRole(adminUsers.roleId)) {
                const userTasks = adminUsers.userTasksList;
                adminUsers.userTasksList = [];
                const dbAdminUser = await this.adminUsersRepository.create(lodash_1.default.omit(adminUsers, 'password'));
                if (dbAdminUser) {
                    const salt = await (0, bcryptjs_1.genSalt)();
                    const password = await (0, bcryptjs_1.hash)(adminUsers.password, salt);
                    await this.adminUsersRepository
                        .userCreds(dbAdminUser.id)
                        .create({ password, salt });
                    const dbUserTasks = await this.addUserTasks(userTasks, dbAdminUser.id);
                    dbAdminUser.userTasks = [...dbUserTasks];
                    result.adminUser = dbAdminUser;
                    result.code = 0;
                    result.msg = 'User and tasks created successfully.';
                }
            }
            else {
                result.msg = 'Invalid role.';
            }
        }
        else {
            result.msg = 'User already exists.';
        }
        return result;
    }
    async checkIfValidRole(roleId) {
        let result = false;
        try {
            const dbRole = await this.rolesRepository.findById(roleId);
            if (dbRole) {
                result = true;
            }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    }
    async checkAdminUserExists(email) {
        let result = true;
        try {
            const adminUsers = await this.adminUsersRepository.find({
                where: { email: email },
            });
            if (adminUsers && adminUsers.length < 1) {
                result = false;
            }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    }
    async addUserTasks(userTasks, adminUsersId) {
        const dbUserTasks = [];
        if (Array.isArray(userTasks) && userTasks.length > 0) {
            userTasks = await this.checkTasks(userTasks, adminUsersId);
            for (const userTask of userTasks) {
                const dbRoleTask = await this.adminUsersRepository
                    .userTasks(adminUsersId)
                    .create(userTask);
                dbUserTasks.push(dbRoleTask);
            }
        }
        return dbUserTasks;
    }
    async checkTasks(userTasks, adminUsersId) {
        let tasks = [];
        for (const userTask of userTasks) {
            tasks.push(userTask.taskId);
        }
        const dbTasks = await this.tasksRepository.find({
            where: { taskId: { inq: tasks } },
            fields: ['taskId'],
        });
        tasks = [];
        for (const dbTask of dbTasks) {
            tasks.push(dbTask.taskId);
        }
        for (let index = 0; index < userTasks.length;) {
            const taskId = userTasks[index].taskId;
            if (tasks.indexOf(taskId) < 0) {
                userTasks.splice(+index, 1);
            }
            else {
                index++;
            }
        }
        const dbUsertasks = await this.adminUsersRepository
            .userTasks(adminUsersId)
            .find({ fields: ['userTaskId', 'taskId'] });
        for (const dbUsertask of dbUsertasks) {
            for (const userTask of userTasks) {
                if (dbUsertask.taskId === userTask.taskId) {
                    userTask.userTaskId = dbUsertask.userTaskId;
                }
            }
        }
        return userTasks;
    }
    async updateUserTasks(userTasks, adminUsersId) {
        if (Array.isArray(userTasks) && userTasks.length > 0) {
            userTasks = await this.checkTasks(userTasks, adminUsersId);
            for (const userTask of userTasks) {
                if (userTask.userTaskId !== undefined) {
                    userTask.updatedAt = new Date();
                    await this.adminUsersRepository
                        .userTasks(adminUsersId)
                        .patch(lodash_1.default.pick(userTask, [
                        'isViewAllowed',
                        'isUpdateAllowed',
                        'isDeleteAllowed',
                        'isCreateAllowed',
                        'updatedAt',
                    ]), {
                        userTaskId: userTask.userTaskId,
                        adminUsersId: userTask.adminUsersId,
                        taskId: userTask.taskId,
                    });
                }
                else {
                    await this.adminUsersRepository
                        .userTasks(adminUsersId)
                        .create(userTask);
                }
            }
        }
    }
    async updateAdminUser(adminUsers) {
        var _a;
        const result = { code: 5, msg: 'User not available', adminUser: {} };
        const dbAdminUser = await this.adminUsersRepository.findOne({ where: { id: adminUsers.id }, include: [{ relation: 'userCreds' }], });
        if (dbAdminUser) {
            adminUsers.userTasksList = [];
            adminUsers.updatedAt = new Date();
            if (await this.checkIfValidRole(adminUsers.roleId)) {
                if (((_a = adminUsers.password) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    const salt = await (0, bcryptjs_1.genSalt)();
                    const password = await (0, bcryptjs_1.hash)(adminUsers.password, salt);
                    await this.adminUsersRepository
                        .userCreds(dbAdminUser.id)
                        .patch({ password, salt });
                }
                await this.adminUsersRepository.updateById(adminUsers.id, lodash_1.default.omit(adminUsers, 'password'));
                result.adminUser = await this.adminUsersRepository.findById(adminUsers.id);
                result.code = 0;
                result.msg = 'Record updated successfully.';
            }
            else {
                result.msg = 'Invalid role';
            }
        }
        return result;
    }
    async count(where) {
        return this.adminUsersRepository.count(where);
    }
    async find(filter) {
        const dbAdminUsers = await this.adminUsersRepository.find({});
        const userRolesList = [];
        for (const adminUser of dbAdminUsers) {
            userRolesList.push(adminUser.roleId);
        }
        const dbRoles = await this.rolesRepository.find({
            where: { roleId: { inq: userRolesList } },
        });
        const rolesMap = new Map();
        for (const role of dbRoles) {
            rolesMap.set(role.roleId, role);
        }
        for (let index = 0; index < dbAdminUsers.length;) {
            const role = rolesMap.get(dbAdminUsers[index].roleId + '');
            dbAdminUsers[index].roleName = role === null || role === void 0 ? void 0 : role.roleName;
            ++index;
        }
        return dbAdminUsers;
    }
    async findById(id, filter) {
        const adminUser = await this.adminUsersRepository.findById(id, {});
        const dbUsertasks = await this.adminUsersRepository
            .userTasks(adminUser.id)
            .find({});
        adminUser.userTasks = [...dbUsertasks];
        return adminUser;
    }
    async updateById(id, adminUsers) {
        await this.adminUsersRepository.updateById(id, adminUsers);
    }
    async replaceById(id, adminUsers) {
        await this.adminUsersRepository.replaceById(id, adminUsers);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/adminUsers/login', {
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
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)(models_1.CredentialsRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.CredentialsRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/adminUsers/createAdminUser'),
    (0, rest_1.response)(200, {
        description: 'AdminUsers model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers, {
                    title: 'NewAdminUsers',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/adminUsers/updateAdminUser'),
    (0, rest_1.response)(200, {
        description: 'Roles PATCH success',
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AdminUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateAdminUser", null);
tslib_1.__decorate([
    (0, rest_1.get)('/adminUsers/count'),
    (0, rest_1.response)(200, {
        description: 'AdminUsers model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.AdminUsers)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/adminUsers/getAllAdminUsers'),
    (0, rest_1.response)(200, {
        description: 'Array of AdminUsers model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.AdminUsers)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/adminUsers/getAdminUser/{id}'),
    (0, rest_1.response)(200, {
        description: 'AdminUsers model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.AdminUsers, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/adminUsers/{id}'),
    (0, rest_1.response)(204, {
        description: 'AdminUsers PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AdminUsers, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.AdminUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/adminUsers/{id}'),
    (0, rest_1.response)(204, {
        description: 'AdminUsers PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.AdminUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AdminUsersController.prototype, "replaceById", null);
AdminUsersController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AdminUsersRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.TasksRepository)),
    tslib_1.__param(2, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(3, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.RolesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AdminUsersRepository,
        repositories_1.TasksRepository, Object, authentication_jwt_1.MyUserService,
        repositories_1.RolesRepository])
], AdminUsersController);
exports.AdminUsersController = AdminUsersController;
//# sourceMappingURL=admin-users.controller.js.map