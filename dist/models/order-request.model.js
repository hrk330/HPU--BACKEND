"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const payment_model_1 = require("./payment.model");
const service_orders_model_1 = require("./service-orders.model");
let OrderRequest = class OrderRequest extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'object',
    }),
    tslib_1.__metadata("design:type", service_orders_model_1.ServiceOrders)
], OrderRequest.prototype, "serviceOrder", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'object',
    }),
    tslib_1.__metadata("design:type", payment_model_1.Payment)
], OrderRequest.prototype, "payment", void 0);
OrderRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], OrderRequest);
exports.OrderRequest = OrderRequest;
//# sourceMappingURL=order-request.model.js.map