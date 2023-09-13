"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderUserDocsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceProviderUserDocsController = class ServiceProviderUserDocsController {
    constructor(serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }
    async find(id, filter) {
        return this.serviceProviderRepository.userDocs(id).find(filter);
    }
    async create(id, userDocs) {
        return this.serviceProviderRepository.userDocs(id).create(userDocs);
    }
    async patch(id, userDocs, where) {
        return this.serviceProviderRepository.userDocs(id).patch(userDocs, where);
    }
    async delete(id, where) {
        return this.serviceProviderRepository.userDocs(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/service-providers/{id}/user-docs', {
        responses: {
            '200': {
                description: 'Array of ServiceProvider has many UserDocs',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.UserDocs) },
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
], ServiceProviderUserDocsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/service-providers/{id}/user-docs', {
        responses: {
            '200': {
                description: 'ServiceProvider model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, {
                    title: 'NewUserDocsInServiceProvider',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderUserDocsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/service-providers/{id}/user-docs', {
        responses: {
            '200': {
                description: 'ServiceProvider.UserDocs PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserDocs))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderUserDocsController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/service-providers/{id}/user-docs', {
        responses: {
            '200': {
                description: 'ServiceProvider.UserDocs DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserDocs))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderUserDocsController.prototype, "delete", null);
ServiceProviderUserDocsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceProviderRepository])
], ServiceProviderUserDocsController);
exports.ServiceProviderUserDocsController = ServiceProviderUserDocsController;
//# sourceMappingURL=service-provider-user-docs.controller.js.map