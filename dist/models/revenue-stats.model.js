"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RevenueStats = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let RevenueStats = class RevenueStats extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], RevenueStats.prototype, "revenue", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], RevenueStats.prototype, "earning", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], RevenueStats.prototype, "coffer", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], RevenueStats.prototype, "outstandingCash", void 0);
RevenueStats = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], RevenueStats);
exports.RevenueStats = RevenueStats;
//# sourceMappingURL=revenue-stats.model.js.map