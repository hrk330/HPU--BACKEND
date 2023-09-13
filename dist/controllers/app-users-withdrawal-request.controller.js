"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsersWithdrawalRequestController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let AppUsersWithdrawalRequestController = class AppUsersWithdrawalRequestController {
    constructor(appUsersRepository) {
        this.appUsersRepository = appUsersRepository;
    }
    async find(id, filter) {
        return this.appUsersRepository.withdrawalRequests(id).find(filter);
    }
    async create(id, withdrawalRequest) {
        return this.appUsersRepository
            .withdrawalRequests(id)
            .create(withdrawalRequest);
    }
    async patch(id, withdrawalRequest, where) {
        return this.appUsersRepository
            .withdrawalRequests(id)
            .patch(withdrawalRequest, where);
    }
    async delete(id, where) {
        return this.appUsersRepository.withdrawalRequests(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/app-users/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'Array of AppUsers has many WithdrawalRequest',
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
], AppUsersWithdrawalRequestController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/app-users/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'AppUsers model instance',
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
                    title: 'NewWithdrawalRequestInAppUsers',
                    exclude: ['withdrawalRequestId'],
                    optional: ['serviceProviderId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersWithdrawalRequestController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/app-users/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'AppUsers.WithdrawalRequest PATCH success count',
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
], AppUsersWithdrawalRequestController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/app-users/{id}/withdrawal-requests', {
        responses: {
            '200': {
                description: 'AppUsers.WithdrawalRequest DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.WithdrawalRequest))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersWithdrawalRequestController.prototype, "delete", null);
AppUsersWithdrawalRequestController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AppUsersRepository])
], AppUsersWithdrawalRequestController);
exports.AppUsersWithdrawalRequestController = AppUsersWithdrawalRequestController;
//# sourceMappingURL=app-users-withdrawal-request.controller.js.map