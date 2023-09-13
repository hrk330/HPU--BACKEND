"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let VehicleController = class VehicleController {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async create(vehicle) {
        const result = { code: 0, msg: 'Vehicle created successfully', vehicle: {} };
        try {
            result.vehicle = await this.vehicleRepository.create(vehicle);
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
    async find(filter) {
        return this.vehicleRepository.find(filter);
    }
    async findUserVehicles(userId, filter) {
        const result = { code: 0, msg: 'Vehicle fetched successfully', vehicle: {} };
        try {
            if (filter) {
                filter.where = { ...filter === null || filter === void 0 ? void 0 : filter.where, userId: userId };
            }
            else {
                filter = { where: { userId: userId } };
            }
            result.vehicle = await this.vehicleRepository.find(filter);
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
    async findById(id, filter) {
        const result = { code: 0, msg: 'Vehicle fetched successfully', vehicle: {} };
        try {
            result.vehicle = await this.vehicleRepository.findById(id, filter);
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
    async updateById(id, vehicle) {
        const result = { code: 0, msg: 'Vehicle updated successfully.', vehicle: {} };
        try {
            await this.vehicleRepository.updateById(id, vehicle);
            result.vehicle = await this.vehicleRepository.findById(id, {});
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
    async deleteById(id) {
        const result = { code: 0, msg: 'Vehicle deleted.' };
        try {
            await this.vehicleRepository.deleteById(id);
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/addVehicle'),
    (0, rest_1.response)(200, {
        description: 'Vehicle model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Vehicle) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vehicle, {
                    title: 'NewVehicle',
                    exclude: ['vehicleId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vehicles'),
    (0, rest_1.response)(200, {
        description: 'Array of Vehicle model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Vehicle, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Vehicle)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vehicles/getUserVehicles/{userId}'),
    (0, rest_1.response)(200, {
        description: 'Array of Vehicle model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Vehicle, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('userId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Vehicle)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "findUserVehicles", null);
tslib_1.__decorate([
    (0, rest_1.get)('/vehicles/getVehicle/{id}'),
    (0, rest_1.response)(200, {
        description: 'Vehicle model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vehicle, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Vehicle, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/updateVehicle/{id}'),
    (0, rest_1.response)(200, {
        description: 'Vehicle PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Vehicle, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Vehicle]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/deleteVehicle/{id}'),
    (0, rest_1.response)(200, {
        description: 'Vehicle DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleController.prototype, "deleteById", null);
VehicleController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.VehicleRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.VehicleRepository])
], VehicleController);
exports.VehicleController = VehicleController;
//# sourceMappingURL=vehicle.controller.js.map