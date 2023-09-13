"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProvider = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const user_creds_model_1 = require("./user-creds.model");
const user_docs_model_1 = require("./user-docs.model");
const withdrawal_request_model_1 = require("./withdrawal-request.model");
const account_model_1 = require("./account.model");
let ServiceProvider = class ServiceProvider extends repository_1.Entity {
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
], ServiceProvider.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "username", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
    }),
    tslib_1.__metadata("design:type", Boolean)
], ServiceProvider.prototype, "emailVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "password", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "companyId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "companyName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "userType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "firstName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "lastName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "dateOfBirth", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "identityNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "address1", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "address2", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "country", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "state", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "city", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "zipCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "phoneNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "isBlocked", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "profilePic", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "verificationCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "passwordUpdatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "isMobileVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'N',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "isProfileCompleted", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "isServiceProviderVerified", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "serviceProviderType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "endpoint", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "socialId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "socialIdType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'P',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "userStatus", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'OF',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "userOnlineStatus", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProvider.prototype, "rating", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProvider.prototype, "totalOrders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "userLocation", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProvider.prototype, "userLocationCoordinates", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], ServiceProvider.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], ServiceProvider.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'object',
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceProvider.prototype, "serviceProviderServicesList", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => user_creds_model_1.UserCreds, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", user_creds_model_1.UserCreds)
], ServiceProvider.prototype, "userCreds", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => user_docs_model_1.UserDocs, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", Array)
], ServiceProvider.prototype, "userDocs", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => withdrawal_request_model_1.WithdrawalRequest, { keyTo: 'serviceProviderId' }),
    tslib_1.__metadata("design:type", Array)
], ServiceProvider.prototype, "withdrawalRequests", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => account_model_1.Account, { keyTo: 'userId' }),
    tslib_1.__metadata("design:type", account_model_1.Account)
], ServiceProvider.prototype, "account", void 0);
ServiceProvider = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ServiceProvider);
exports.ServiceProvider = ServiceProvider;
//# sourceMappingURL=service-provider.model.js.map