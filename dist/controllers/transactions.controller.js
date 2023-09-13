"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let TransactionsController = class TransactionsController {
    constructor(transactionRepository) {
        this.transactionRepository = transactionRepository;
    }
    async create(transaction) {
        return this.transactionRepository.create(transaction);
    }
    async count(where) {
        return this.transactionRepository.count(where);
    }
    async find(filter) {
        return this.transactionRepository.find(filter);
    }
    async findById(id, filter) {
        return this.transactionRepository.findById(id, filter);
    }
    async updateById(id, transaction) {
        await this.transactionRepository.updateById(id, transaction);
    }
    async replaceById(id, transaction) {
        await this.transactionRepository.replaceById(id, transaction);
    }
    async deleteById(id) {
        await this.transactionRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/transactions'),
    (0, rest_1.response)(200, {
        description: 'Transaction model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Transaction) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Transaction, {
                    title: 'NewTransaction',
                    exclude: ['transactionId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/transactions/count'),
    (0, rest_1.response)(200, {
        description: 'Transaction model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Transaction)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/transactions'),
    (0, rest_1.response)(200, {
        description: 'Array of Transaction model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Transaction, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Transaction)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/transactions/{id}'),
    (0, rest_1.response)(200, {
        description: 'Transaction model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Transaction, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Transaction, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/transactions/{id}'),
    (0, rest_1.response)(204, {
        description: 'Transaction PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Transaction, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Transaction]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/transactions/{id}'),
    (0, rest_1.response)(204, {
        description: 'Transaction PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Transaction]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/transactions/{id}'),
    (0, rest_1.response)(204, {
        description: 'Transaction DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TransactionsController.prototype, "deleteById", null);
TransactionsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.TransactionRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.TransactionRepository])
], TransactionsController);
exports.TransactionsController = TransactionsController;
//# sourceMappingURL=transactions.controller.js.map