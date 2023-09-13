"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyServiceProviderController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CompanyServiceProviderController = class CompanyServiceProviderController {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async find(id, filter) {
        return this.companyRepository.serviceProviders(id).find(filter);
    }
    async create(id, serviceProvider) {
        return this.companyRepository.serviceProviders(id).create(serviceProvider);
    }
    async patch(id, serviceProvider, where) {
        return this.companyRepository
            .serviceProviders(id)
            .patch(serviceProvider, where);
    }
    async delete(id, where) {
        return this.companyRepository.serviceProviders(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/companies/{id}/service-providers', {
        responses: {
            '200': {
                description: 'Array of Company has many ServiceProvider',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) },
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
], CompanyServiceProviderController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/{id}/service-providers', {
        responses: {
            '200': {
                description: 'Company model instance',
                content: {
                    'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewServiceProviderInCompany',
                    exclude: ['id'],
                    optional: ['companyId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyServiceProviderController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/companies/{id}/service-providers', {
        responses: {
            '200': {
                description: 'Company.ServiceProvider PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.ServiceProvider))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyServiceProviderController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/companies/{id}/service-providers', {
        responses: {
            '200': {
                description: 'Company.ServiceProvider DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.ServiceProvider))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyServiceProviderController.prototype, "delete", null);
CompanyServiceProviderController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CompanyRepository])
], CompanyServiceProviderController);
exports.CompanyServiceProviderController = CompanyServiceProviderController;
//# sourceMappingURL=company-service-provider.controller.js.map