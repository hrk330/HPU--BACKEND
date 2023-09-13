"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let WithdrawalRequest = class WithdrawalRequest extends repository_1.Entity {
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
], WithdrawalRequest.prototype, "withdrawalRequestId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "serviceProviderId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "serviceProviderUsername", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "serviceProviderName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'L',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "comments", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "bankName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "accountNumber", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "accountHolderName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "swiftCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], WithdrawalRequest.prototype, "withdrawalAmount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], WithdrawalRequest.prototype, "unpaidAmount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "rejectionReason", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "profilePic", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: 'S',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "createdBy", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], WithdrawalRequest.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], WithdrawalRequest.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], WithdrawalRequest.prototype, "userAccountId", void 0);
WithdrawalRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], WithdrawalRequest);
exports.WithdrawalRequest = WithdrawalRequest;
//# sourceMappingURL=withdrawal-request.model.js.map