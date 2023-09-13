"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsersUserDocsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let AppUsersUserDocsController = class AppUsersUserDocsController {
    constructor(appUsersRepository) {
        this.appUsersRepository = appUsersRepository;
    }
    async find(id, filter) {
        return this.appUsersRepository.userDocs(id).find(filter);
    }
    async create(id, userDocs) {
        return this.appUsersRepository.userDocs(id).create(userDocs);
    }
    async patch(id, userDocs, where) {
        return this.appUsersRepository.userDocs(id).patch(userDocs, where);
    }
    async delete(id, where) {
        return this.appUsersRepository.userDocs(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/app-users/{id}/user-docs', {
        responses: {
            '200': {
                description: 'Array of AppUsers has many UserDocs',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: (0, rest_1.getModelSchemaRef)(models_1.UserDocs) },
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
], AppUsersUserDocsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.post)('/app-users/{id}/user-docs', {
        responses: {
            '200': {
                description: 'AppUsers model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, {
                    title: 'NewUserDocsInAppUsers',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersUserDocsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/app-users/{id}/user-docs', {
        responses: {
            '200': {
                description: 'AppUsers.UserDocs PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserDocs))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersUserDocsController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/app-users/{id}/user-docs', {
        responses: {
            '200': {
                description: 'AppUsers.UserDocs DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserDocs))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersUserDocsController.prototype, "delete", null);
AppUsersUserDocsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AppUsersRepository])
], AppUsersUserDocsController);
exports.AppUsersUserDocsController = AppUsersUserDocsController;
//# sourceMappingURL=app-users-user-docs.controller.js.map