"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderWithdrawalRequestController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceProviderWithdrawalRequestController = class ServiceProviderWithdrawalRequestController {
    constructor(serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }
    async find(id, filter) {
        return this.serviceProviderRepository.withdrawalRequests(id).find(filter);
    }
    async create(id, withdrawalRequest) {
        return this.serviceProviderRepository
            .withdrawalRequests(id)
            .create(withdrawalRequest);
    }
    async patch(id, withdrawalRequest, where) {
        return this.serviceProviderRepository
            .withdrawalRequests(id)
            .patch(withdrawalRequest, where);
    }
    async delete(id, where) {
        return this.serviceProviderRepository.withdrawalRequests(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/service-providers/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'Array of ServiceProvider has many WithdrawalRequest',
                content: {
                    'application/json': {
                        schema: {
                            type: 'array',
                            items: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest),
                        },
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
], ServiceProviderWithdrawalRequestController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/service-providers/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'ServiceProvider model instance',
                content: {
                    'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, {
                    title: 'NewWithdrawalRequestInServiceProvider',
                    exclude: ['withdrawalRequestId'],
                    optional: ['serviceProviderId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderWithdrawalRequestController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/service-providers/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'ServiceProvider.WithdrawalRequest PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.WithdrawalRequest))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderWithdrawalRequestController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/service-providers/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'ServiceProvider.WithdrawalRequest DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.WithdrawalRequest))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderWithdrawalRequestController.prototype, "delete", null);
ServiceProviderWithdrawalRequestController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceProviderRepository])
], ServiceProviderWithdrawalRequestController);
exports.ServiceProviderWithdrawalRequestController = ServiceProviderWithdrawalRequestController;
//# sourceMappingURL=service-provider-withdrawal-request.controller.js.map