"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesRoleTasksController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let RolesRoleTasksController = class RolesRoleTasksController {
    constructor(rolesRepository) {
        this.rolesRepository = rolesRepository;
    }
    async find(id, filter) {
        return this.rolesRepository.roleTasks(id).find(filter);
    }
    async create(id, roleTasks) {
        return this.rolesRepository.roleTasks(id).create(roleTasks);
    }
    async patch(id, roleTasks, where) {
        return this.rolesRepository.roleTasks(id).patch(roleTasks, where);
    }
    async delete(id, where) {
        return this.rolesRepository.roleTasks(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/roles/{id}/role-tasks', {
        responses: {
            '200': {
                description: 'Array of Roles has many RoleTasks',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesRoleTasksController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/roles/{id}/role-tasks', {
        responses: {
            '200': {
                description: 'Roles model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, {
                    title: 'NewRoleTasksInRoles',
                    exclude: ['roleTaskId'],
                    optional: ['roleId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesRoleTasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/roles/{id}/role-tasks', {
        responses: {
            '200': {
                description: 'Roles.RoleTasks PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.RoleTasks))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesRoleTasksController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/roles/{id}/role-tasks', {
        responses: {
            '200': {
                description: 'Roles.RoleTasks DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.RoleTasks))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RolesRoleTasksController.prototype, "delete", null);
RolesRoleTasksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.RolesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RolesRepository])
], RolesRoleTasksController);
exports.RolesRoleTasksController = RolesRoleTasksController;
//# sourceMappingURL=roles-role-tasks.controller.js.map