"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrashReportsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CrashReportsController = class CrashReportsController {
    constructor(crashReportsRepository) {
        this.crashReportsRepository = crashReportsRepository;
    }
    async create(crashReports) {
        return this.crashReportsRepository.create(crashReports);
    }
    async count(where) {
        return this.crashReportsRepository.count(where);
    }
    async find(filter) {
        return this.crashReportsRepository.find(filter);
    }
    async findById(id, filter) {
        return this.crashReportsRepository.findById(id, filter);
    }
    async updateById(id, crashReports) {
        await this.crashReportsRepository.updateById(id, crashReports);
    }
    async replaceById(id, crashReports) {
        await this.crashReportsRepository.replaceById(id, crashReports);
    }
    async deleteById(id) {
        await this.crashReportsRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/crashReports'),
    (0, rest_1.response)(200, {
        description: 'CrashReports model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, {
                    title: 'NewCrashReports',
                    exclude: ['crashReportId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/crashReports/count'),
    (0, rest_1.response)(200, {
        description: 'CrashReports model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.CrashReports)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/crashReports'),
    (0, rest_1.response)(200, {
        description: 'Array of CrashReports model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.CrashReports)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/crashReports/{id}'),
    (0, rest_1.response)(200, {
        description: 'CrashReports model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.CrashReports, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/crashReports/{id}'),
    (0, rest_1.response)(204, {
        description: 'CrashReports PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.CrashReports]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/crashReports/{id}'),
    (0, rest_1.response)(204, {
        description: 'CrashReports PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.CrashReports]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/crashReports/{id}'),
    (0, rest_1.response)(204, {
        description: 'CrashReports DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsController.prototype, "deleteById", null);
CrashReportsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CrashReportsRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CrashReportsRepository])
], CrashReportsController);
exports.CrashReportsController = CrashReportsController;
//# sourceMappingURL=crash-reports.controller.js.map