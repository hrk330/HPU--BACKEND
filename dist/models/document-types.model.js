"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentTypes = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let DocumentTypes = class DocumentTypes extends repository_1.Entity {
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
], DocumentTypes.prototype, "docTypeId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], DocumentTypes.prototype, "docType", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: true,
    }),
    tslib_1.__metadata("design:type", Boolean)
], DocumentTypes.prototype, "isActive", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: '$now',
    }),
    tslib_1.__metadata("design:type", Date)
], DocumentTypes.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
    }),
    tslib_1.__metadata("design:type", Date)
], DocumentTypes.prototype, "updatedAt", void 0);
DocumentTypes = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], DocumentTypes);
exports.DocumentTypes = DocumentTypes;
//# sourceMappingURL=document-types.model.js.map