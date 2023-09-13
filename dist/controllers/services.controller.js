"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServicesController = class ServicesController {
    constructor(servicesRepository) {
        this.servicesRepository = servicesRepository;
    }
    async create(services) {
        return this.servicesRepository.create(services);
    }
    async count(where) {
        return this.servicesRepository.count(where);
    }
    async find(filter) {
        return this.servicesRepository.find(filter);
    }
    async findById(id, filter) {
        return this.servicesRepository.findById(id, filter);
    }
    async updateById(id, services) {
        services.updatedAt = new Date();
        if (services.price && isNaN(services.price)) {
            services.price = 0;
        }
        if (services.pricePerKm && isNaN(+services.pricePerKm)) {
            services.pricePerKm = 0;
        }
        if (services.salesTax && isNaN(+services.salesTax)) {
            services.salesTax = 0;
        }
        await this.servicesRepository.updateById(id, services);
        return {
            success: {
                code: 0,
                msg: 'Record updated successfully.',
                service: await this.servicesRepository.findById(id, {}),
            },
        };
    }
    async replaceById(id, services) {
        await this.servicesRepository.replaceById(id, services);
    }
    async deleteById(id) {
        await this.servicesRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/services/createService'),
    (0, rest_1.response)(200, {
        description: 'Services model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Services) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Services, {
                    title: 'NewServices',
                    exclude: ['serviceId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/services/count'),
    (0, rest_1.response)(200, {
        description: 'Services model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Services)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/services/getAllServices'),
    (0, rest_1.response)(200, {
        description: 'Array of Services model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Services, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Services)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/services/getService/{id}'),
    (0, rest_1.response)(200, {
        description: 'Services model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Services, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Services, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/services/updateService/{id}'),
    (0, rest_1.response)(200, {
        description: 'Services PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Services, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Services]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/services/{id}'),
    (0, rest_1.response)(204, {
        description: 'Services PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Services]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/services/{id}'),
    (0, rest_1.response)(204, {
        description: 'Services DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesController.prototype, "deleteById", null);
ServicesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServicesRepository])
], ServicesController);
exports.ServicesController = ServicesController;
//# sourceMappingURL=services.controller.js.map