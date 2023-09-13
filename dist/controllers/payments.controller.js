"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let PaymentsController = class PaymentsController {
    constructor(paymentRepository) {
        this.paymentRepository = paymentRepository;
    }
    async create(payment) {
        return this.paymentRepository.create(payment);
    }
    async count(where) {
        return this.paymentRepository.count(where);
    }
    async find(filter) {
        return this.paymentRepository.find(filter);
    }
    async findById(id, filter) {
        return this.paymentRepository.findById(id, filter);
    }
    async updateById(id, payment) {
        await this.paymentRepository.updateById(id, payment);
    }
    async replaceById(id, payment) {
        await this.paymentRepository.replaceById(id, payment);
    }
    async deleteById(id) {
        await this.paymentRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/payments'),
    (0, rest_1.response)(200, {
        description: 'Payment model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Payment) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Payment, {
                    title: 'NewPayment',
                    exclude: ['paymentId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/payments/count'),
    (0, rest_1.response)(200, {
        description: 'Payment model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Payment)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/payments'),
    (0, rest_1.response)(200, {
        description: 'Array of Payment model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Payment, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Payment)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/payments/{id}'),
    (0, rest_1.response)(200, {
        description: 'Payment model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Payment, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Payment, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/payments/{id}'),
    (0, rest_1.response)(204, {
        description: 'Payment PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Payment, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Payment]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/payments/{id}'),
    (0, rest_1.response)(204, {
        description: 'Payment PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Payment]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/payments/{id}'),
    (0, rest_1.response)(204, {
        description: 'Payment DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PaymentsController.prototype, "deleteById", null);
PaymentsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.PaymentRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.PaymentRepository])
], PaymentsController);
exports.PaymentsController = PaymentsController;
//# sourceMappingURL=payments.controller.js.map