"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUsersUserCredsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let AppUsersUserCredsController = class AppUsersUserCredsController {
    constructor(appUsersRepository) {
        this.appUsersRepository = appUsersRepository;
    }
    async get(id, filter) {
        return this.appUsersRepository.userCreds(id).get(filter);
    }
    async create(id, userCreds) {
        return this.appUsersRepository.userCreds(id).create(userCreds);
    }
    async patch(id, userCreds, where) {
        return this.appUsersRepository.userCreds(id).patch(userCreds, where);
    }
    async delete(id, where) {
        return this.appUsersRepository.userCreds(id).delete(where);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/app-users/{id}/user-creds', {
        responses: {
            '200': {
                description: 'AppUsers has one UserCreds',
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
], AppUsersUserCredsController.prototype, "get", null);
tslib_1.__decorate([
    (0, rest_1.post)('/app-users/{id}/user-creds', {
        responses: {
            '200': {
                description: 'AppUsers model instance',
                content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds) } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserCreds, {
                    title: 'NewUserCredsInAppUsers',
                    exclude: ['id'],
                    optional: ['userId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersUserCredsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/app-users/{id}/user-creds', {
        responses: {
            '200': {
                description: 'AppUsers.UserCreds PATCH success count',
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
], AppUsersUserCredsController.prototype, "patch", null);
tslib_1.__decorate([
    (0, rest_1.del)('/app-users/{id}/user-creds', {
        responses: {
            '200': {
                description: 'AppUsers.UserCreds DELETE success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.query.object('where', (0, rest_1.getWhereSchemaFor)(models_1.UserCreds))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUsersUserCredsController.prototype, "delete", null);
AppUsersUserCredsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AppUsersRepository])
], AppUsersUserCredsController);
exports.AppUsersUserCredsController = AppUsersUserCredsController;
//# sourceMappingURL=app-users-user-creds.controller.js.map