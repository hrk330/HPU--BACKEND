"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const withdrawal_request_model_1 = require("./withdrawal-request.model");
let Account = class Account extends repository_1.Entity {
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
], Account.prototype, "accountId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Account.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Account.prototype, "balanceAmount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Account.prototype, "lastPaymentAmount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Account.prototype, "lastPaymentType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Account.prototype, "lastPaymentDate", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], Account.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], Account.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => withdrawal_request_model_1.WithdrawalRequest, { keyTo: 'userAccountId' }),
    tslib_1.__metadata("design:type", Array)
], Account.prototype, "withdrawalRequests", void 0);
Account = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], Account);
exports.Account = Account;
//# sourceMappingURL=account.model.js.map