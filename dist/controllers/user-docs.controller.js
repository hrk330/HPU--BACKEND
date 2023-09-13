"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDocsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let UserDocsController = class UserDocsController {
    constructor(userDocsRepository) {
        this.userDocsRepository = userDocsRepository;
    }
    async create(userDocs) {
        return this.userDocsRepository.create(userDocs);
    }
    async count(where) {
        return this.userDocsRepository.count(where);
    }
    async find(filter) {
        return this.userDocsRepository.find(filter);
    }
    async findById(id, filter) {
        return this.userDocsRepository.findById(id, filter);
    }
    async updateById(id, userDocs) {
        const result = {
            code: 0,
            msg: 'Document updated successfully.',
            userDoc: {},
        };
        await this.userDocsRepository.updateById(id, userDocs);
        const userDoc = await this.userDocsRepository.findById(id, {});
        result.userDoc = userDoc;
        return JSON.stringify(result);
    }
    async replaceById(id, userDocs) {
        await this.userDocsRepository.replaceById(id, userDocs);
    }
    async deleteById(id) {
        await this.userDocsRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/userDocs'),
    (0, rest_1.response)(200, {
        description: 'UserDocs model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, {
                    title: 'NewUserDocs',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userDocs/count'),
    (0, rest_1.response)(200, {
        description: 'UserDocs model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.UserDocs)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userDocs'),
    (0, rest_1.response)(200, {
        description: 'Array of UserDocs model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.UserDocs)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/userDocs/{id}'),
    (0, rest_1.response)(200, {
        description: 'UserDocs model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.UserDocs, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/userDocs/updateUserDocs/{id}'),
    (0, rest_1.response)(200, {
        description: 'UserDocs update success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.UserDocs, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.UserDocs]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/userDocs/{id}'),
    (0, rest_1.response)(204, {
        description: 'UserDocs PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.UserDocs]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/userDocs/{id}'),
    (0, rest_1.response)(204, {
        description: 'UserDocs DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserDocsController.prototype, "deleteById", null);
UserDocsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.UserDocsRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserDocsRepository])
], UserDocsController);
exports.UserDocsController = UserDocsController;
//# sourceMappingURL=user-docs.controller.js.map