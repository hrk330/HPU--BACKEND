"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderServicesController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceProviderServicesController = class ServiceProviderServicesController {
    constructor(serviceProviderServicesRepository, servicesRepository) {
        this.serviceProviderServicesRepository = serviceProviderServicesRepository;
        this.servicesRepository = servicesRepository;
    }
    async create(serviceProviderServicesRequest) {
        var _a;
        const result = {
            code: 5,
            msg: 'Some error occurred while creating service provider services.',
            serviceProviderServicesList: {},
        };
        const servicesArray = [];
        const serviceProviderServiceMap = new Map();
        if (Array.isArray(serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList) &&
            ((_a = serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList.forEach((serviceProviderService) => {
                if (serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId) {
                    servicesArray.push(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId);
                    serviceProviderServiceMap.set(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId, serviceProviderService);
                }
            });
            const finalServicesArray = await this.checkServicesExist(servicesArray);
            const serviceProviderServicesList = [];
            for (const finalService of finalServicesArray) {
                const serviceProviderServices = serviceProviderServiceMap.get(finalService.serviceId + '');
                if ((serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId) &&
                    (serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.userId)) {
                    const serviceProviderServiceArray = await this.checkServiceProviderServiceExist(serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId, serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.userId);
                    if (!serviceProviderServiceArray ||
                        (serviceProviderServiceArray === null || serviceProviderServiceArray === void 0 ? void 0 : serviceProviderServiceArray.length) === 0) {
                        const serviceProviderServiceObject = new models_1.ServiceProviderServices();
                        serviceProviderServiceObject.serviceId =
                            serviceProviderServices.serviceId;
                        serviceProviderServiceObject.isActive =
                            serviceProviderServices.isActive;
                        serviceProviderServiceObject.userId =
                            serviceProviderServices.userId;
                        serviceProviderServiceObject.serviceName = finalService.serviceName;
                        serviceProviderServiceObject.serviceType = finalService.serviceType;
                        serviceProviderServiceObject.vehicleType = finalService.vehicleType;
                        serviceProviderServiceObject.accidental = finalService.accidental;
                        serviceProviderServicesList.push(await this.serviceProviderServicesRepository.create(serviceProviderServiceObject));
                    }
                }
            }
            result.code = 0;
            result.msg = 'Service provider services created successfully.';
            result.serviceProviderServicesList = serviceProviderServicesList;
        }
        return JSON.stringify(result);
    }
    async updateServiceProviderServices(serviceProviderServicesRequest) {
        var _a;
        const result = {
            code: 5,
            msg: 'Some error occurred while updating service provider services.',
            serviceProviderServicesList: {},
        };
        const serviceProviderServiceArray = [];
        if (Array.isArray(serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList) &&
            ((_a = serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const serviceProviderServicesList = serviceProviderServicesRequest === null || serviceProviderServicesRequest === void 0 ? void 0 : serviceProviderServicesRequest.serviceProviderServicesList;
            for (const serviceProviderService of serviceProviderServicesList) {
                if (serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.id) {
                    serviceProviderServiceArray.push(serviceProviderService.id);
                    serviceProviderService.updatedAt = new Date();
                    await this.serviceProviderServicesRepository.updateById(serviceProviderService.id, serviceProviderService);
                }
            }
            result.code = 0;
            result.msg = 'Service provider services updated successfully.';
            result.serviceProviderServicesList =
                await this.serviceProviderServicesRepository.find({
                    where: { id: { inq: serviceProviderServiceArray } },
                });
        }
        return JSON.stringify(result);
    }
    async checkServicesExist(servicesArray) {
        const finalServicesArray = await this.servicesRepository.find({
            where: { serviceId: { inq: servicesArray } },
            fields: ['serviceId', 'serviceName', 'serviceType', 'vehicleType'],
        });
        return finalServicesArray;
    }
    async checkServiceProviderServiceExist(serviceId, userId) {
        const serviceProviderServiceArray = await this.serviceProviderServicesRepository.find({
            where: { serviceId: serviceId, userId: userId },
            fields: ['serviceId'],
        });
        return serviceProviderServiceArray;
    }
    async count(where) {
        return this.serviceProviderServicesRepository.count(where);
    }
    async find(filter) {
        return this.serviceProviderServicesRepository.find(filter);
    }
    async findById(id, filter) {
        return this.serviceProviderServicesRepository.findById(id, filter);
    }
    async updateById(id, serviceProviderServices) {
        await this.serviceProviderServicesRepository.updateById(id, serviceProviderServices);
    }
    async replaceById(id, serviceProviderServices) {
        await this.serviceProviderServicesRepository.replaceById(id, serviceProviderServices);
    }
    async deleteById(id) {
        await this.serviceProviderServicesRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProviderServices/createServices'),
    (0, rest_1.response)(200, {
        description: 'ServiceProviderServices model instance',
        content: {
            'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServices) },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServicesRequest, {
                    title: 'NewServiceProviderServices',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProviderServicesRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProviderServices/updateServices'),
    (0, rest_1.response)(200, {
        description: 'ServiceProviderServices model instance',
        content: {
            'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServices) },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServicesRequest, {
                    title: 'NewServiceProviderServices',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProviderServicesRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "updateServiceProviderServices", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProviderServices/count'),
    (0, rest_1.response)(200, {
        description: 'ServiceProviderServices model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.ServiceProviderServices)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProviderServices'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceProviderServices model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServices, {
                        includeRelations: true,
                    }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.ServiceProviderServices)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProviderServices/{id}'),
    (0, rest_1.response)(200, {
        description: 'ServiceProviderServices model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServices, {
                    includeRelations: true,
                }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceProviderServices, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/serviceProviderServices/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProviderServices PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProviderServices, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceProviderServices]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/serviceProviderServices/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProviderServices PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceProviderServices]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/serviceProviderServices/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProviderServices DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceProviderServicesController.prototype, "deleteById", null);
ServiceProviderServicesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceProviderServicesRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceProviderServicesRepository,
        repositories_1.ServicesRepository])
], ServiceProviderServicesController);
exports.ServiceProviderServicesController = ServiceProviderServicesController;
//# sourceMappingURL=service-provider-services.controller.js.map