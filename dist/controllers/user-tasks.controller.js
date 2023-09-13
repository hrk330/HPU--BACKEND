"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTasksController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UserTasksController = class UserTasksController {
    constructor(userTasksRepository) {
        this.userTasksRepository = userTasksRepository;
    }
    async create(userTasks) {
        return this.userTasksRepository.create(userTasks);
    }
    async count(where) {
        return this.userTasksRepository.count(where);
    }
    async find(filter) {
        return this.userTasksRepository.find(filter);
    }
    async findById(id, filter) {
        return this.userTasksRepository.findById(id, filter);
    }
    async updateById(id, userTasks) {
        await this.userTasksRepository.updateById(id, userTasks);
    }
    async replaceById(id, userTasks) {
        await this.userTasksRepository.replaceById(id, userTasks);
    }
    async deleteById(id) {
        await this.userTasksRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/userTasks'),
    (0, rest_1.response)(200, {
        description: 'UserTasks model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserTasks) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserTasks, {
                    title: 'NewUserTasks',
                    exclude: ['userTaskId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userTasks/count'),
    (0, rest_1.response)(200, {
        description: 'UserTasks model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.UserTasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userTasks'),
    (0, rest_1.response)(200, {
        description: 'Array of UserTasks model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.UserTasks, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.UserTasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userTasks/{id}'),
    (0, rest_1.response)(200, {
        description: 'UserTasks model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserTasks, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.UserTasks, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/userTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'UserTasks PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserTasks, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.UserTasks]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/userTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'UserTasks PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.UserTasks]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/userTasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'UserTasks DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserTasksController.prototype, "deleteById", null);
UserTasksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.UserTasksRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserTasksRepository])
], UserTasksController);
exports.UserTasksController = UserTasksController;
//# sourceMappingURL=user-tasks.controller.js.map