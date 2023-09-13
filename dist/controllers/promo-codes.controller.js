"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromoCodesController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let PromoCodesController = class PromoCodesController {
    constructor(promoCodesRepository) {
        this.promoCodesRepository = promoCodesRepository;
    }
    async create(promoCodes) {
        const result = { code: 5, msg: '', promoCode: {} };
        if (await this.checkPromoExists('', promoCodes.promoCode)) {
            result.msg = 'Promo code already exists.';
        }
        else if (promoCodes.totalLimit < promoCodes.userLimit) {
            result.msg = 'User usage limit should be less than total limit.';
        }
        else {
            result.promoCode = await this.promoCodesRepository.create(promoCodes);
            result.code = 0;
            result.msg = 'Promo code generated successfully.';
        }
        return result;
    }
    async count(where) {
        return this.promoCodesRepository.count(where);
    }
    async find(filter) {
        return this.promoCodesRepository.find(filter);
    }
    async findById(promoId, filter) {
        return this.promoCodesRepository.findById(promoId, filter);
    }
    async updateById(requestPromoCode) {
        const result = { code: 5, msg: '', promoCode: {} };
        if (await this.checkPromoExists(requestPromoCode.promoId, requestPromoCode.promoCode)) {
            result.msg = 'Duplicate promo code.';
        }
        else if (requestPromoCode.totalLimit < requestPromoCode.userLimit) {
            result.msg = 'User usage limit should be less than total limit.';
        }
        else {
            await this.promoCodesRepository.updateById(requestPromoCode.promoId, requestPromoCode);
            result.promoCode = await this.findById(requestPromoCode.promoId);
            result.code = 0;
            result.msg = 'Record updated successfully.';
        }
        return result;
    }
    async checkPromoExists(promoId, promoCode) {
        let result = true;
        try {
            const dbPromoCode = await this.promoCodesRepository.find({
                where: { promoCode: promoCode },
            });
            if (dbPromoCode.length < 1 ||
                (dbPromoCode.length < 2 && dbPromoCode[0].promoId === promoId)) {
                result = false;
            }
        }
        catch (e) {
            console.log(e);
        }
        return result;
    }
    async generateRandomPromo() {
        const result = { code: 5, msg: 'Invalid Request', promoCode: '' };
        for (let i = 0; i < 50; i++) {
            result.promoCode = await this.generateRandomString(8);
            console.log(result.promoCode);
            if (!(await this.checkPromoExists('', result.promoCode))) {
                break;
            }
        }
        result.code = 0;
        result.msg = 'Promo code generated successfully.';
        return result;
    }
    async generateRandomString(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    }
    async replaceById(promoId, promoCodes) {
        await this.promoCodesRepository.replaceById(promoId, promoCodes);
    }
    async deleteById(promoId) {
        await this.promoCodesRepository.deleteById(promoId);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/promoCodes/createPromoCode'),
    (0, rest_1.response)(200, {
        description: 'PromoCodes model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.PromoCodes) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.PromoCodes, {
                    title: 'NewPromoCodes',
                    exclude: ['promoId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/promoCodes/count'),
    (0, rest_1.response)(200, {
        description: 'PromoCodes model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.PromoCodes)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/promoCodes/getPromoCodes'),
    (0, rest_1.response)(200, {
        description: 'Array of PromoCodes model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.PromoCodes, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.PromoCodes)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/promoCodes/{promoId}'),
    (0, rest_1.response)(200, {
        description: 'PromoCodes model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.PromoCodes, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('promoId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.PromoCodes, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/promoCodes/updatePromoCode'),
    (0, rest_1.response)(200, {
        description: 'PromoCodes PATCH success',
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.PromoCodes, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.PromoCodes]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.get)('/promoCodes/generateRandomPromoCode'),
    (0, rest_1.response)(200, {
        description: 'PromoCodes PATCH success',
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "generateRandomPromo", null);
tslib_1.__decorate([
    (0, rest_1.put)('/promoCodes/{promoId}'),
    (0, rest_1.response)(204, {
        description: 'PromoCodes PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('promoId')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.PromoCodes]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/promoCodes/{promoId}'),
    (0, rest_1.response)(204, {
        description: 'PromoCodes DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('promoId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PromoCodesController.prototype, "deleteById", null);
PromoCodesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.PromoCodesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.PromoCodesRepository])
], PromoCodesController);
exports.PromoCodesController = PromoCodesController;
//# sourceMappingURL=promo-codes.controller.js.map