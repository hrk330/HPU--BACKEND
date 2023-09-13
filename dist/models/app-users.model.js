"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsers = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_creds_model_1 = require("./user-creds.model");
const vehicle_model_1 = require("./vehicle.model");
const user_docs_model_1 = require("./user-docs.model");
const account_model_1 = require("./account.model");
const withdrawal_request_model_1 = require("./withdrawal-request.model");
let AppUsers = class AppUsers extends repository_1.Entity {
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
], AppUsers.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "username", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
    }),
    tslib_1.__metadata("design:type", Boolean)
], AppUsers.prototype, "emailVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "password", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "userType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "dateOfBirth", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "identityNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "address1", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "address2", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "country", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "state", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "city", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "zipCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "phoneNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "isBlocked", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "profilePic", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "verificationCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "passwordUpdatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "isMobileVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "isProfileCompleted", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "isServiceProviderVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "serviceProviderType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "endpoint", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "socialId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "socialIdType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'P',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "userStatus", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'OF',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "userOnlineStatus", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], AppUsers.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], AppUsers.prototype, "totalOrders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "userLocation", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], AppUsers.prototype, "userLocationCoordinates", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], AppUsers.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], AppUsers.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'object',
    }),
    tslib_1.__metadata("design:type", Array)
], AppUsers.prototype, "serviceProviderServicesList", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => vehicle_model_1.Vehicle, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", Array)
], AppUsers.prototype, "vehicles", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => user_creds_model_1.UserCreds, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", user_creds_model_1.UserCreds)
], AppUsers.prototype, "userCreds", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => user_docs_model_1.UserDocs, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", Array)
], AppUsers.prototype, "userDocs", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => account_model_1.Account, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", account_model_1.Account)
], AppUsers.prototype, "account", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => withdrawal_request_model_1.WithdrawalRequest, { keyTo: 'serviceProviderId' }),
    tslib_1.__metadata("design:type", Array)
], AppUsers.prototype, "withdrawalRequests", void 0);
AppUsers = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], AppUsers);
exports.AppUsers = AppUsers;
//# sourceMappingURL=app-users.model.js.map