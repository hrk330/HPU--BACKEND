"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CredentialsRequestBody = exports.CredentialsRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
let CredentialsRequest = class CredentialsRequest extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], CredentialsRequest.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        format: 'email',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], CredentialsRequest.prototype, "email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        minLength: 8,
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], CredentialsRequest.prototype, "password", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        minLength: 8,
    }),
    tslib_1.__metadata("design:type", String)
], CredentialsRequest.prototype, "oldPassword", void 0);
CredentialsRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], CredentialsRequest);
exports.CredentialsRequest = CredentialsRequest;
exports.CredentialsRequestBody = {
    description: 'The input of login function',
    required: true,
    content: {
        'application/json': {
            schema: (0, rest_1.getModelSchemaRef)(CredentialsRequest, {
                title: 'CredentialsRequestBody',
            }),
        },
    },
};
//# sourceMappingURL=credentials-request.model.js.map