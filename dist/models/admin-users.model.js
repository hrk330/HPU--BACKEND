"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUsers = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_tasks_model_1 = require("./user-tasks.model");
const user_creds_model_1 = require("./user-creds.model");
let AdminUsers = class AdminUsers extends repository_1.Entity {
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
], AdminUsers.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "username", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
    }),
    tslib_1.__metadata("design:type", Boolean)
], AdminUsers.prototype, "emailVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "password", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "dateOfBirth", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "identityNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "address1", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "address2", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "country", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "state", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "city", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "zipCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "phoneNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "isBlocked", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "roleName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "passwordUpdatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "isMobileVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], AdminUsers.prototype, "isProfileCompleted", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], AdminUsers.prototype, "wrongTries", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], AdminUsers.prototype, "lastSuccessfulLogin", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], AdminUsers.prototype, "lastUnsuccessfulLogin", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], AdminUsers.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], AdminUsers.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'any',
    }),
    tslib_1.__metadata("design:type", Array)
], AdminUsers.prototype, "userTasksList", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => user_tasks_model_1.UserTasks, { keyTo: 'adminUsersId' }),
    tslib_1.__metadata("design:type", Array)
], AdminUsers.prototype, "userTasks", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => user_creds_model_1.UserCreds, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", user_creds_model_1.UserCreds)
], AdminUsers.prototype, "userCreds", void 0);
AdminUsers = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], AdminUsers);
exports.AdminUsers = AdminUsers;
//# sourceMappingURL=admin-users.model.js.map