"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const role_tasks_model_1 = require("./role-tasks.model");
let Roles = class Roles extends repository_1.Entity {
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
], Roles.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Roles.prototype, "roleName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], Roles.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], Roles.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Roles.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'any',
    }),
    tslib_1.__metadata("design:type", Array)
], Roles.prototype, "roleTasks", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => role_tasks_model_1.RoleTasks, { keyTo: 'roleId' }),
    tslib_1.__metadata("design:type", Array)
], Roles.prototype, "roleTaskList", void 0);
Roles = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.model.js.map