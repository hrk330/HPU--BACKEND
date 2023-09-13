"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let RolesController = class RolesController {
    constructor(rolesRepository, tasksRepository) {
        this.rolesRepository = rolesRepository;
        this.tasksRepository = tasksRepository;
    }
    async create(roles) {
        const result = { code: 5, msg: '', role: {} };
        if (!(await this.checkRoleExists('', roles.roleName))) {
            const roleTasks = roles.roleTasks;
            roles.roleTasks = [];
            const dbRole = await this.addRole(roles);
            const dbRoletasks = await this.addRoleTasks(roleTasks, dbRole.roleId);
            dbRole.roleTasks = [...dbRoletasks];
            result.role = dbRole;
            result.code = 0;
            result.msg = 'Role and tasks created successfully.';
        }
        else {
            result.msg = 'Role already exists.';
        }
        return result;
    }
    async checkRoleExists(roleId, roleName) {
        let result = true;
        try {
            const dbRoles = await this.rolesRepository.find({
                where: { roleName: roleName },
            });
            if (dbRoles.length < 1 ||
                (dbRoles.length < 2 && dbRoles[0].roleId === roleId)) {
                result = false;
            }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    }
    async addRole(roles) {
        return this.rolesRepository.create(roles);
    }
    async addRoleTasks(roleTasks, roleId) {
        const dbRoletasks = [];
        if (Array.isArray(roleTasks) && roleTasks.length > 0) {
            roleTasks = await this.checkTasks(roleTasks);
            for (const roleTask of roleTasks) {
                const dbRoleTask = await this.rolesRepository
                    .roleTasks(roleId)
                    .create(roleTask);
                dbRoletasks.push(dbRoleTask);
            }
        }
        return dbRoletasks;
    }
    async updateRoleTasks(roleTasks, roleId) {
        if (Array.isArray(roleTasks) && roleTasks.length > 0) {
            roleTasks = await this.checkTasks(roleTasks);
            for (const roleTask of roleTasks) {
                if (roleTask.roleTaskId !== undefined) {
                    roleTask.updatedAt = new Date();
                    await this.rolesRepository
                        .roleTasks(roleId)
                        .patch(lodash_1.default.pick(roleTask, [
                        'isViewAllowed',
                        'isUpdateAllowed',
                        'isDeleteAllowed',
                        'isCreateAllowed',
                        'updatedAt',
                    ]), { taskId: roleTask.taskId });
                }
                else {
                    await this.rolesRepository.roleTasks(roleId).create(roleTask);
                }
            }
        }
    }
    async checkTasks(roleTasks) {
        let tasks = [];
        for (const roleTask of roleTasks) {
            tasks.push(roleTask.taskId);
        }
        const dbTasks = await this.tasksRepository.find({
            where: { taskId: { inq: tasks } },
            fields: ['taskId'],
        });
        tasks = [];
        for (const dbTask of dbTasks) {
            tasks.push(dbTask.taskId);
        }
        for (let index = 0; index < roleTasks.length;) {
            const taskId = roleTasks[index].taskId;
            if (tasks.indexOf(taskId) < 0) {
                roleTasks.splice(+index, 1);
            }
            else {
                index++;
            }
        }
        return roleTasks;
    }
    async count(where) {
        return this.rolesRepository.count(where);
    }
    async find(filter) {
        return this.rolesRepository.find({
            fields: ['roleId', 'roleName', 'isActive'],
        });
    }
    async findById(id, filter) {
        return this.rolesRepository.findById(id, { include: ['roleTasks'] });
    }
    async updateById(roles) {
        const result = { code: 5, msg: '', role: {} };
        if (!(await this.checkRoleExists(roles.roleId, roles.roleName))) {
            const roleTasks = roles.roleTasks;
            roles.roleTasks = [];
            await this.rolesRepository.updateById(roles.roleId, lodash_1.default.pick(roles, ['roleName', 'isActive']));
            const dbRole = await this.findById(roles.roleId);
            await this.updateRoleTasks(roleTasks, roles.roleId);
            const dbRoletasks = await this.rolesRepository
                .roleTasks(roles.roleId)
                .find({});
            dbRole.roleTasks = [...dbRoletasks];
            result.role = dbRole;
            result.code = 0;
            result.msg = 'Record updated successfully.';
        }
        else {
            result.msg = 'Duplicate role name.';
        }
        return result;
    }
    async replaceById(id, roles) {
        await this.rolesRepository.replaceById(id, roles);
    }
    async deleteById(id) {
        await this.rolesRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/roles/createRoleAndTasks'),
    (0, rest_1.response)(200, {
        description: 'Roles model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Roles) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Roles, {
                    title: 'NewRoles',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Roles]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roles/count'),
    (0, rest_1.response)(200, {
        description: 'Roles model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Roles)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roles/getRoles'),
    (0, rest_1.response)(200, {
        description: 'Array of Roles model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Roles, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Roles)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roles/{id}'),
    (0, rest_1.response)(200, {
        description: 'Roles model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Roles, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Roles, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/roles/updateRoles'),
    (0, rest_1.response)(200, {
        description: 'Roles PATCH success',
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Roles, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Roles]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/roles/{id}'),
    (0, rest_1.response)(204, {
        description: 'Roles PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Roles]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/roles/{id}'),
    (0, rest_1.response)(204, {
        description: 'Roles DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesController.prototype, "deleteById", null);
RolesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.RolesRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.TasksRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RolesRepository,
        repositories_1.TasksRepository])
], RolesController);
exports.RolesController = RolesController;
//# sourceMappingURL=roles.controller.js.map