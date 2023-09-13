"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleRemindersController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let VehicleRemindersController = class VehicleRemindersController {
    constructor(vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }
    async find(id, filter) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting reminders.',
            reminder: {},
        };
        try {
            result.reminder = await this.vehicleRepository.reminders(id).find(filter);
            result.code = 0;
            result.msg = 'Reminders fetched successfully.';
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async create(id, reminders) {
        const result = {
            code: 5,
            msg: 'Some error occurred while creating reminder.',
            reminder: {},
        };
        try {
            result.reminder = await this.vehicleRepository
                .reminders(id)
                .create(reminders);
            result.code = 0;
            result.msg = 'Reminder created successfully.';
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async patch(id, reminders, where) {
        const result = {
            code: 5,
            msg: 'Some error occurred while updating reminder.',
            reminder: {},
        };
        try {
            await this.vehicleRepository.reminders(id).patch(reminders, where);
            result.reminder = await this.vehicleRepository
                .reminders(id)
                .find({ where });
            result.code = 0;
            result.msg = 'Reminder updated successfully.';
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async delete(id, where) {
        const result = {
            code: 5,
            msg: 'Some error occurred while deleting reminder.',
            reminder: {},
        };
        try {
            await this.vehicleRepository.reminders(id).delete(where);
            result.code = 0;
            result.msg = 'Reminder deleted successfully.';
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/vehicles/{id}/getVehicleReminders', {
        responses: {
            '200': {
                description: 'Array of Vehicle has many Reminders',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.Reminders) },
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
], VehicleRemindersController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/{id}/createVehicleReminders', {
        responses: {
            '200': {
                description: 'Vehicle model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Reminders) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Reminders, {
                    title: 'NewRemindersInVehicle',
                    exclude: ['reminderId'],
                    optional: ['vehicleId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleRemindersController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/{id}/updateVehicleReminders', {
        responses: {
            '200': {
                description: 'Vehicle.Reminders PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Reminders, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Reminders))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleRemindersController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.post)('/vehicles/{id}/reminders', {
        responses: {
            '200': {
                description: 'Vehicle.Reminders DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.Reminders))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VehicleRemindersController.prototype, "delete", null);
VehicleRemindersController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.VehicleRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.VehicleRepository])
], VehicleRemindersController);
exports.VehicleRemindersController = VehicleRemindersController;
//# sourceMappingURL=vehicle-reminders.controller.js.map