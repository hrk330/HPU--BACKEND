"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequestsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let WithdrawalRequestsController = class WithdrawalRequestsController {
    constructor(withdrawalRequestRepository, serviceProviderRepository, accountRepository) {
        this.withdrawalRequestRepository = withdrawalRequestRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.accountRepository = accountRepository;
    }
    async create(withdrawalRequest) {
        const result = {
            code: 5,
            msg: 'Some error occurred while creating withdrawal request.',
            withdrawalRequest: {},
        };
        try {
            if (withdrawalRequest.serviceProviderId) {
                const userAccount = await this.accountRepository
                    .findOne({ where: { userId: withdrawalRequest.serviceProviderId } });
                if (userAccount) {
                    if (!(withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount) ||
                        (withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount) < 1200) {
                        result.msg = 'Withdrawal amount should be greater than 1200.';
                    }
                    else if (!(userAccount === null || userAccount === void 0 ? void 0 : userAccount.balanceAmount) ||
                        (userAccount === null || userAccount === void 0 ? void 0 : userAccount.balanceAmount) < 1200) {
                        result.msg = 'Insufficient balance.';
                    }
                    else {
                        withdrawalRequest.withdrawalAmount = userAccount.balanceAmount;
                        withdrawalRequest.unpaidAmount = userAccount.balanceAmount;
                        const dbWithdrawalRequest = await this.withdrawalRequestRepository.create(withdrawalRequest);
                        userAccount.balanceAmount = 0;
                        await this.accountRepository
                            .update(userAccount, { where: { userId: withdrawalRequest.serviceProviderId } });
                        result.code = 0;
                        result.msg = 'Withdrawal request created successfully.';
                        result.withdrawalRequest = dbWithdrawalRequest;
                    }
                }
                else {
                    result.msg = "Account not found";
                }
            }
            else {
                result.msg = "User not found";
            }
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async createAdminWithdrawalRequest(withdrawalRequest) {
        const result = {
            code: 5,
            msg: 'Some error occurred while creating withdrawal request.',
            withdrawalRequest: {},
        };
        try {
            if (withdrawalRequest.serviceProviderId) {
                const userAccount = await this.accountRepository
                    .findOne({ where: { userId: withdrawalRequest.serviceProviderId } });
                if (userAccount) {
                    if (!(withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount)) {
                        result.msg = 'Enter withdrawal amount.';
                    }
                    else if ((withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount) >
                        (userAccount === null || userAccount === void 0 ? void 0 : userAccount.balanceAmount)) {
                        result.msg = 'Insufficient balance.';
                    }
                    else {
                        withdrawalRequest.unpaidAmount = withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount;
                        const dbWithdrawalRequest = await this.withdrawalRequestRepository.create(withdrawalRequest);
                        userAccount.balanceAmount -= withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount;
                        await this.accountRepository
                            .update(userAccount, { where: { userId: withdrawalRequest.serviceProviderId } });
                        result.code = 0;
                        result.msg = 'Withdrawal request created successfully.';
                        result.withdrawalRequest = dbWithdrawalRequest;
                    }
                }
                else {
                    result.msg = "Account not found";
                }
            }
            else {
                result.msg = "User not found";
            }
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async serviceProviderGetAllRequests(serviceProviderId, filter) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting withdrawal requests.',
            withdrawalRequest: {},
        };
        try {
            if (filter) {
                filter.where = { ...filter.where, serviceProviderId: serviceProviderId };
            }
            else {
                filter = { where: { serviceProviderId: serviceProviderId } };
            }
            if (serviceProviderId) {
                result.withdrawalRequest = await this.withdrawalRequestRepository.find(filter);
                result.code = 0;
                result.msg = 'Withdrawal requests fetched successfully.';
            }
        }
        catch (e) {
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async adminGetAllRequests(filter) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting withdrawal requests.',
            withdrawalRequest: {},
        };
        try {
            result.withdrawalRequest = await this.withdrawalRequestRepository.find(filter);
            result.code = 0;
            result.msg = 'Withdrawal requests fetched successfully.';
        }
        catch (e) {
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async findById(id, filter) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting withdrawal request.',
            withdrawalRequest: {},
        };
        try {
            result.withdrawalRequest =
                await this.withdrawalRequestRepository.findById(id, filter);
            result.code = 0;
            result.msg = 'Withdrawal request fetched successfully.';
        }
        catch (e) {
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async updateWithdrawalRequest(id, withdrawalRequest) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting withdrawal requests.',
            withdrawalRequest: {},
        };
        try {
            if (id && withdrawalRequest.serviceProviderId) {
                const userAccount = await this.accountRepository
                    .findOne({ where: { userId: withdrawalRequest.serviceProviderId } });
                const dbWithdrawalRequest = await this.withdrawalRequestRepository.findById(id, {});
                if (userAccount && dbWithdrawalRequest && dbWithdrawalRequest.status === "P" && withdrawalRequest.serviceProviderId) {
                    withdrawalRequest.updatedAt = new Date();
                    if (withdrawalRequest.status === "A") {
                        withdrawalRequest.unpaidAmount = 0;
                        await this.withdrawalRequestRepository.updateById(id, withdrawalRequest);
                    }
                    else if (withdrawalRequest.status === "R") {
                        userAccount.balanceAmount = dbWithdrawalRequest.withdrawalAmount;
                        await this.accountRepository
                            .update(userAccount, { where: { userId: withdrawalRequest.serviceProviderId } });
                        await this.withdrawalRequestRepository.updateById(id, withdrawalRequest);
                    }
                    result.withdrawalRequest =
                        await this.withdrawalRequestRepository.findById(id, {});
                    result.code = 0;
                    result.msg = 'Withdrawal requests fetched successfully.';
                }
                else {
                    result.msg = "Account not found";
                }
            }
            {
                result.msg = "Invalid request";
            }
        }
        catch (e) {
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async deleteById(id) {
        await this.withdrawalRequestRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/withdrawalRequests/createWithdrawalRequest'),
    (0, rest_1.response)(200, {
        description: 'WithdrawalRequest model instance',
        content: {
            'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest) },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, {
                    title: 'NewWithdrawalRequest',
                    exclude: ['withdrawalRequestId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/withdrawalRequests/admin/createWithdrawalRequest'),
    (0, rest_1.response)(200, {
        description: 'WithdrawalRequest model instance',
        content: {
            'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest) },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, {
                    title: 'NewWithdrawalRequest',
                    exclude: ['withdrawalRequestId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "createAdminWithdrawalRequest", null);
tslib_1.__decorate([
    (0, rest_1.get)('/withdrawalRequests/serviceProvider/{serviceProviderId}/getAllRequests'),
    (0, rest_1.response)(200, {
        description: 'Array of WithdrawalRequest model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('serviceProviderId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.WithdrawalRequest)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "serviceProviderGetAllRequests", null);
tslib_1.__decorate([
    (0, rest_1.get)('/withdrawalRequests/Admin/getAllRequests'),
    (0, rest_1.response)(200, {
        description: 'Array of WithdrawalRequest model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.WithdrawalRequest)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "adminGetAllRequests", null);
tslib_1.__decorate([
    (0, rest_1.get)('/withdrawalRequests/fetchWithdrawalRequest/{id}'),
    (0, rest_1.response)(200, {
        description: 'WithdrawalRequest model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.WithdrawalRequest, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/withdrawalRequests/updateWithdrawalRequest/{id}'),
    (0, rest_1.response)(200, {
        description: 'WithdrawalRequest PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WithdrawalRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.WithdrawalRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "updateWithdrawalRequest", null);
tslib_1.__decorate([
    (0, rest_1.post)('/withdrawalRequests/deleteWithdrawalRequest/{id}'),
    (0, rest_1.response)(200, {
        description: 'WithdrawalRequest DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], WithdrawalRequestsController.prototype, "deleteById", null);
WithdrawalRequestsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.WithdrawalRequestRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.AccountRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.WithdrawalRequestRepository,
        repositories_1.ServiceProviderRepository,
        repositories_1.AccountRepository])
], WithdrawalRequestsController);
exports.WithdrawalRequestsController = WithdrawalRequestsController;
//# sourceMappingURL=withdrawal-requests.controller.js.map