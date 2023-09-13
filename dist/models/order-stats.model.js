"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStats = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let OrderStats = class OrderStats extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], OrderStats.prototype, "totalOrders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], OrderStats.prototype, "completedOrders", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], OrderStats.prototype, "canceledOrders", void 0);
OrderStats = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], OrderStats);
exports.OrderStats = OrderStats;
//# sourceMappingURL=order-stats.model.js.map