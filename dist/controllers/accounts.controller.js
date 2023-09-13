"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let AccountsController = class AccountsController {
    constructor(accountRepository, serviceOrdersRepository, serviceProviderRepository) {
        this.accountRepository = accountRepository;
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.serviceProviderRepository = serviceProviderRepository;
    }
    async create(account) {
        return this.accountRepository.create(account);
    }
    async count(where) {
        return this.accountRepository.count(where);
    }
    async find(filter) {
        return this.accountRepository.find(filter);
    }
    async getAccountInfo(serviceProviderId) {
        const result = {
            code: 5,
            msg: 'No record found.',
            account: {},
            withdrawalRequests: {},
            totalWithdrawanAmount: 0,
            totalEarnedAmmount: 0,
        };
        const account = await this.serviceProviderRepository
            .account(serviceProviderId)
            .get({});
        if (account === null || account === void 0 ? void 0 : account.accountId) {
            const last5WithdrawalRequests = await this.accountRepository
                .withdrawalRequests(account.accountId)
                .find({ limit: 5, order: ['createdAt desc'] });
            const allWithdrawalRequests4Sum = await this.accountRepository
                .withdrawalRequests(account.accountId)
                .find({ where: { status: 'C' }, fields: ['withdrawalAmount'] });
            let totalWithdrawanAmount = 0;
            if ((allWithdrawalRequests4Sum === null || allWithdrawalRequests4Sum === void 0 ? void 0 : allWithdrawalRequests4Sum.length) > 0) {
                allWithdrawalRequests4Sum.forEach(withdrawalRequest => {
                    if (withdrawalRequest === null || withdrawalRequest === void 0 ? void 0 : withdrawalRequest.withdrawalAmount) {
                        totalWithdrawanAmount += withdrawalRequest.withdrawalAmount;
                    }
                });
            }
            let totalEarnedAmmount = 0;
            const orders = await this.serviceOrdersRepository.find({
                where: { serviceProviderId: serviceProviderId, status: 'PC' },
            });
            orders.forEach(order => {
                if (order === null || order === void 0 ? void 0 : order.netAmount) {
                    totalEarnedAmmount += order.netAmount;
                }
            });
            result.code = 0;
            result.account = account;
            result.withdrawalRequests = last5WithdrawalRequests;
            result.totalWithdrawanAmount = totalWithdrawanAmount;
            result.totalEarnedAmmount = totalEarnedAmmount;
        }
        return JSON.stringify(result);
    }
    async findById(id, filter) {
        return this.accountRepository.findById(id, filter);
    }
    async updateById(id, account) {
        await this.accountRepository.updateById(id, account);
    }
    async replaceById(id, account) {
        await this.accountRepository.replaceById(id, account);
    }
    async deleteById(id) {
        await this.accountRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/accounts'),
    (0, rest_1.response)(200, {
        description: 'Account model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Account) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Account, {
                    title: 'NewAccount',
                    exclude: ['accountId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/accounts/count'),
    (0, rest_1.response)(200, {
        description: 'Account model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Account)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/accounts'),
    (0, rest_1.response)(200, {
        description: 'Array of Account model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Account, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Account)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/accounts/serviceProvider/getAccountInfo/{serviceProviderId}'),
    (0, rest_1.response)(200, {
        description: 'Array of Account model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Account, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('serviceProviderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "getAccountInfo", null);
tslib_1.__decorate([
    (0, rest_1.get)('/accounts/{id}'),
    (0, rest_1.response)(200, {
        description: 'Account model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Account, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Account, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/accounts/{id}'),
    (0, rest_1.response)(204, {
        description: 'Account PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Account, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Account]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/accounts/{id}'),
    (0, rest_1.response)(204, {
        description: 'Account PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Account]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/accounts/{id}'),
    (0, rest_1.response)(204, {
        description: 'Account DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountsController.prototype, "deleteById", null);
AccountsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AccountRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AccountRepository,
        repositories_1.ServiceOrdersRepository,
        repositories_1.ServiceProviderRepository])
], AccountsController);
exports.AccountsController = AccountsController;
//# sourceMappingURL=accounts.controller.js.map