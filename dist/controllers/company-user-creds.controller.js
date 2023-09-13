"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyUserCredsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let CompanyUserCredsController = class CompanyUserCredsController {
    constructor(companyRepository) {
        this.companyRepository = companyRepository;
    }
    async get(id, filter) {
        return this.companyRepository.userCreds(id).get(filter);
    }
    async create(id, userCreds) {
        return this.companyRepository.userCreds(id).create(userCreds);
    }
    async patch(id, userCreds, where) {
        return this.companyRepository.userCreds(id).patch(userCreds, where);
    }
    async delete(id, where) {
        return this.companyRepository.userCreds(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/companies/{id}/user-creds', {
        responses: {
            '200': {
                description: 'Company has one UserCreds',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('filter')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyUserCredsController.prototype, "get", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/{id}/user-creds', {
        responses: {
            '200': {
                description: 'Company model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds, {
                    title: 'NewUserCredsInCompany',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyUserCredsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/companies/{id}/user-creds', {
        responses: {
            '200': {
                description: 'Company.UserCreds PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserCreds))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyUserCredsController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/companies/{id}/user-creds', {
        responses: {
            '200': {
                description: 'Company.UserCreds DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserCreds))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyUserCredsController.prototype, "delete", null);
CompanyUserCredsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CompanyRepository])
], CompanyUserCredsController);
exports.CompanyUserCredsController = CompanyUserCredsController;
//# sourceMappingURL=company-user-creds.controller.js.map