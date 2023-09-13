"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderStats = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ServiceProviderStats = class ServiceProviderStats extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProviderStats.prototype, "totalServiceProviders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProviderStats.prototype, "approvedServiceProviders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProviderStats.prototype, "rejectedServiceProviders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProviderStats.prototype, "serviceProviderId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ServiceProviderStats.prototype, "serviceProviderName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProviderStats.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ServiceProviderStats.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], ServiceProviderStats.prototype, "joinedDateTime", void 0);
ServiceProviderStats = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ServiceProviderStats);
exports.ServiceProviderStats = ServiceProviderStats;
//# sourceMappingURL=service-provider-stats.model.js.map