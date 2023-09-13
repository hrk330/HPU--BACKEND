"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyBankAccountController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CompanyBankAccountController = class CompanyBankAccountController {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async get(id, filter) {
        return this.companyRepository.bankAccount(id).get(filter);
    }
    async create(id, bankAccount) {
        return this.companyRepository.bankAccount(id).create(bankAccount);
    }
    async patch(id, bankAccount, where) {
        return this.companyRepository.bankAccount(id).patch(bankAccount, where);
    }
    async delete(id, where) {
        return this.companyRepository.bankAccount(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/companies/{id}/bank-account', {
        responses: {
            '200': {
                description: 'Company has one BankAccount',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.BankAccount),
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
], CompanyBankAccountController.prototype, "get", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/{id}/bank-account', {
        responses: {
            '200': {
                description: 'Company model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.BankAccount) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.BankAccount, {
                    title: 'NewBankAccountInCompany',
                    exclude: ['bankAccountId'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyBankAccountController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/companies/{id}/bank-account', {
        responses: {
            '200': {
                description: 'Company.BankAccount PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.BankAccount, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.BankAccount))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyBankAccountController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/companies/{id}/bank-account', {
        responses: {
            '200': {
                description: 'Company.BankAccount DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.BankAccount))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyBankAccountController.prototype, "delete", null);
CompanyBankAccountController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CompanyRepository])
], CompanyBankAccountController);
exports.CompanyBankAccountController = CompanyBankAccountController;
//# sourceMappingURL=company-bank-account.controller.js.map