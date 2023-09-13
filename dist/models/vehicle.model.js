"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vehicle = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const reminders_model_1 = require("./reminders.model");
let Vehicle = class Vehicle extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "vehicleId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "plateNumber", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "vehicleType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "registerationDate", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "annualInspectionDate", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "annualInsuranceDate", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Vehicle.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], Vehicle.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Vehicle.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => reminders_model_1.Reminders),
    tslib_1.__metadata("design:type", Array)
], Vehicle.prototype, "reminders", void 0);
Vehicle = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Vehicle);
exports.Vehicle = Vehicle;
//# sourceMappingURL=vehicle.model.js.map