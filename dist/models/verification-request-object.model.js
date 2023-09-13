"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerificationRequestObject = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let VerificationRequestObject = class VerificationRequestObject extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "verificationCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "phoneNo", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], VerificationRequestObject.prototype, "userType", void 0);
VerificationRequestObject = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], VerificationRequestObject);
exports.VerificationRequestObject = VerificationRequestObject;
//# sourceMappingURL=verification-request-object.model.js.map