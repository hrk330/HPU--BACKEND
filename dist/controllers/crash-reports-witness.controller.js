"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrashReportsWitnessController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CrashReportsWitnessController = class CrashReportsWitnessController {
    constructor(crashReportsRepository) {
        this.crashReportsRepository = crashReportsRepository;
    }
    async find(id, filter) {
        return this.crashReportsRepository.witnesses(id).find(filter);
    }
    async create(id, witness) {
        return this.crashReportsRepository.witnesses(id).create(witness);
    }
    async patch(id, witness, where) {
        return this.crashReportsRepository.witnesses(id).patch(witness, where);
    }
    async delete(id, where) {
        return this.crashReportsRepository.witnesses(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/crash-reports/{id}/witnesses', {
        responses: {
            '200': {
                description: 'Array of CrashReports has many Witness',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.Witness) },
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
], CrashReportsWitnessController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/crash-reports/{id}/witnesses', {
        responses: {
            '200': {
                description: 'CrashReports model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Witness) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Witness, {
                    title: 'NewWitnessInCrashReports',
                    exclude: ['witnessId'],
                    optional: ['crashReportId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsWitnessController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/crash-reports/{id}/witnesses', {
        responses: {
            '200': {
                description: 'CrashReports.Witness PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Witness, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Witness))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsWitnessController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/crash-reports/{id}/witnesses', {
        responses: {
            '200': {
                description: 'CrashReports.Witness DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Witness))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CrashReportsWitnessController.prototype, "delete", null);
CrashReportsWitnessController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CrashReportsRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CrashReportsRepository])
], CrashReportsWitnessController);
exports.CrashReportsWitnessController = CrashReportsWitnessController;
//# sourceMappingURL=crash-reports-witness.controller.js.map