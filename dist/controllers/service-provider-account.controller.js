"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderAccountController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceProviderAccountController = class ServiceProviderAccountController {
    constructor(serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }
    async get(id, filter) {
        return this.serviceProviderRepository.account(id).get(filter);
    }
    async create(id, account) {
        return this.serviceProviderRepository.account(id).create(account);
    }
    async patch(id, account, where) {
        return this.serviceProviderRepository.account(id).patch(account, where);
    }
    async delete(id, where) {
        return this.serviceProviderRepository.account(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/service-providers/{id}/account', {
        responses: {
            '200': {
                description: 'ServiceProvider has one Account',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.Account),
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
], ServiceProviderAccountController.prototype, "get", null);
tslib_1.__decorate([
    (0, rest_1.post)('/service-providers/{id}/account', {
        responses: {
            '200': {
                description: 'ServiceProvider model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Account) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Account, {
                    title: 'NewAccountInServiceProvider',
                    exclude: ['accountId'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderAccountController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/service-providers/{id}/account', {
        responses: {
            '200': {
                description: 'ServiceProvider.Account PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Account, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Account))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderAccountController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/service-providers/{id}/account', {
        responses: {
            '200': {
                description: 'ServiceProvider.Account DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Account))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderAccountController.prototype, "delete", null);
ServiceProviderAccountController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceProviderRepository])
], ServiceProviderAccountController);
exports.ServiceProviderAccountController = ServiceProviderAccountController;
//# sourceMappingURL=service-provider-account.controller.js.map