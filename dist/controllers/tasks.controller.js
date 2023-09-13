"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let TasksController = class TasksController {
    constructor(tasksRepository) {
        this.tasksRepository = tasksRepository;
    }
    async create(tasks) {
        return this.tasksRepository.create(tasks);
    }
    async count(where) {
        return this.tasksRepository.count(where);
    }
    async find(filter) {
        return this.tasksRepository.find(filter);
    }
    async findById(id, filter) {
        return this.tasksRepository.findById(id, filter);
    }
    async updateById(id, tasks) {
        await this.tasksRepository.updateById(id, tasks);
    }
    async replaceById(id, tasks) {
        await this.tasksRepository.replaceById(id, tasks);
    }
    async deleteById(id) {
        await this.tasksRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/tasks'),
    (0, rest_1.response)(200, {
        description: 'Tasks model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Tasks) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Tasks, {
                    title: 'NewTasks',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.Tasks]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/tasks/count'),
    (0, rest_1.response)(200, {
        description: 'Tasks model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Tasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/tasks'),
    (0, rest_1.response)(200, {
        description: 'Array of Tasks model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Tasks, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Tasks)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/tasks/{id}'),
    (0, rest_1.response)(200, {
        description: 'Tasks model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Tasks, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Tasks, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/tasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'Tasks PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Tasks, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Tasks]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/tasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'Tasks PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Tasks]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/tasks/{id}'),
    (0, rest_1.response)(204, {
        description: 'Tasks DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TasksController.prototype, "deleteById", null);
TasksController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.TasksRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TasksRepository])
], TasksController);
exports.TasksController = TasksController;
//# sourceMappingURL=tasks.controller.js.map