"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersServicesController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceOrdersServicesController = class ServiceOrdersServicesController {
    constructor(serviceOrdersRepository) {
        this.serviceOrdersRepository = serviceOrdersRepository;
    }
    async getServices(id) {
        return this.serviceOrdersRepository.service(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/service-orders/{id}/services', {
        responses: {
            '200': {
                description: 'Services belonging to ServiceOrders',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.Services) },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersServicesController.prototype, "getServices", null);
ServiceOrdersServicesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceOrdersRepository])
], ServiceOrdersServicesController);
exports.ServiceOrdersServicesController = ServiceOrdersServicesController;
//# sourceMappingURL=service-orders-services.controller.js.map