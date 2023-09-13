"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceProviderServicesRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ServiceProviderServicesRequest = class ServiceProviderServicesRequest extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'object',
    }),
    tslib_1.__metadata("design:type", Array)
], ServiceProviderServicesRequest.prototype, "serviceProviderServicesList", void 0);
ServiceProviderServicesRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ServiceProviderServicesRequest);
exports.ServiceProviderServicesRequest = ServiceProviderServicesRequest;
//# sourceMappingURL=service-provider-services-request.model.js.map