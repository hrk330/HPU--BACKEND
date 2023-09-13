"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleTasksController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let RoleTasksController = class RoleTasksController {
    constructor(roleTasksRepository) {
        this.roleTasksRepository = roleTasksRepository;
    }
    async create(roleTasks) {
        return this.roleTasksRepository.create(roleTasks);
    }
    async count(where) {
        return this.roleTasksRepository.count(where);
    }
    async find(filter) {
        return this.roleTasksRepository.find(filter);
    }
    async findById(id, filter) {
        return this.roleTasksRepository.findById(id, filter);
    }
    async updateById(id, roleTasks) {
        await this.roleTasksRepository.updateById(id, roleTasks);
    }
    async replaceById(id, roleTasks) {
        await this.roleTasksRepository.replaceById(id, roleTasks);
    }
    async deleteById(id) {
        await this.roleTasksRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/roleTasks'),
    (0, rest_1.response)(200, {
        description: 'RoleTasks model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, {
                    title: 'NewRoleTasks',
                    exclude: ['roleTaskId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roleTasks/count'),
    (0, rest_1.response)(200, {
        description: 'RoleTasks model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.RoleTasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roleTasks'),
    (0, rest_1.response)(200, {
        description: 'Array of RoleTasks model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.RoleTasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/roleTasks/{id}'),
    (0, rest_1.response)(200, {
        description: 'RoleTasks model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.RoleTasks, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/roleTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'RoleTasks PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.RoleTasks, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.RoleTasks]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/roleTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'RoleTasks PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.RoleTasks]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/roleTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'RoleTasks DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RoleTasksController.prototype, "deleteById", null);
RoleTasksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.RoleTasksRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.RoleTasksRepository])
], RoleTasksController);
exports.RoleTasksController = RoleTasksController;
//# sourceMappingURL=role-tasks.controller.js.map