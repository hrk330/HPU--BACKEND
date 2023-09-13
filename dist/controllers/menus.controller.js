"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MenusController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let MenusController = class MenusController {
    constructor(menusRepository, adminUsersRepository, rolesRepository) {
        this.menusRepository = menusRepository;
        this.adminUsersRepository = adminUsersRepository;
        this.rolesRepository = rolesRepository;
    }
    async create(menus) {
        return this.menusRepository.create(menus);
    }
    async count(where) {
        return this.menusRepository.count(where);
    }
    async find() {
        const dbMenusList = await this.menusRepository.find({
            where: { isActive: true },
        });
        const parentChildMenuStructure = [];
        await this.getParentChildMenuStructure(dbMenusList, parentChildMenuStructure);
        return parentChildMenuStructure;
    }
    async getSidebarMenus(userId) {
        const dbMenusList = await this.menusRepository.find({
            where: { isActive: true },
        });
        const adminUser = await this.adminUsersRepository.findById(userId, { fields: ['roleId'] });
        const dbRoletasks = await this.rolesRepository
            .roleTasks(adminUser.roleId)
            .find({ where: { isActive: true } });
        await this.filterMenuForUserRole(dbMenusList, dbRoletasks);
        const parentChildMenuStructure = [];
        await this.getParentChildMenuStructure(dbMenusList, parentChildMenuStructure);
        return parentChildMenuStructure;
    }
    async filterMenuForUserRole(dbMenusList, dbRoletasks) {
        var _a, _b, _c, _d;
        const roleTaskMap = new Map();
        for (const dbRoleTask of dbRoletasks) {
            roleTaskMap.set(dbRoleTask.taskId, dbRoleTask);
        }
        for (let index = 0; index < dbMenusList.length;) {
            if ((roleTaskMap === null || roleTaskMap === void 0 ? void 0 : roleTaskMap.has((_a = dbMenusList[index]) === null || _a === void 0 ? void 0 : _a.taskId)) &&
                ((_c = roleTaskMap === null || roleTaskMap === void 0 ? void 0 : roleTaskMap.get((_b = dbMenusList[index]) === null || _b === void 0 ? void 0 : _b.taskId)) === null || _c === void 0 ? void 0 : _c.isViewAllowed)) {
                const roleTask = roleTaskMap.get((_d = dbMenusList[index]) === null || _d === void 0 ? void 0 : _d.taskId);
                dbMenusList[index].isViewAllowed = roleTask === null || roleTask === void 0 ? void 0 : roleTask.isViewAllowed;
                dbMenusList[index].isCreateAllowed = roleTask === null || roleTask === void 0 ? void 0 : roleTask.isCreateAllowed;
                dbMenusList[index].isUpdateAllowed = roleTask === null || roleTask === void 0 ? void 0 : roleTask.isUpdateAllowed;
                dbMenusList[index].isDeleteAllowed = roleTask === null || roleTask === void 0 ? void 0 : roleTask.isDeleteAllowed;
                index++;
            }
            else {
                dbMenusList.splice(index, 1);
            }
        }
    }
    async getParentChildMenuStructure(dbMenusList, parentChildMenuStructure) {
        dbMenusList.forEach(parentMenu => {
            dbMenusList.forEach(childMenu => {
                if (childMenu.parentMenuId &&
                    childMenu.parentMenuId.toString() === parentMenu.menuId.toString()) {
                    if (parentMenu.children === undefined) {
                        parentMenu.children = [];
                    }
                    childMenu.subChildren = [];
                    if (parentMenu.subChildren !== undefined) {
                        childMenu.parentMenuId = parentMenu.parentMenuId;
                        parentMenu.subChildren.push(childMenu);
                    }
                    else {
                        parentMenu.children.push(childMenu);
                    }
                }
            });
            parentChildMenuStructure.push(parentMenu);
        });
        for (let index = 0; index < parentChildMenuStructure.length;) {
            if (parentChildMenuStructure[index].parentMenuId !== '') {
                parentChildMenuStructure.splice(index, 1);
            }
            else {
                index++;
            }
        }
    }
    async findById(id, filter) {
        return this.menusRepository.findById(id, filter);
    }
    async updateById(id, menus) {
        await this.menusRepository.updateById(id, menus);
    }
    async replaceById(id, menus) {
        await this.menusRepository.replaceById(id, menus);
    }
    async deleteById(id) {
        await this.menusRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/menus'),
    (0, rest_1.response)(200, {
        description: 'Menus model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Menus) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Menus, {
                    title: 'NewMenus',
                    exclude: ['menuId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/menus/count'),
    (0, rest_1.response)(200, {
        description: 'Menus model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Menus)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/menus/getAllMenus'),
    (0, rest_1.response)(200, {
        description: 'Array of Menus model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Menus, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/menus/getSidebarMenus/{userId}'),
    (0, rest_1.response)(200, {
        description: 'Array of Menus model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Menus, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "getSidebarMenus", null);
tslib_1.__decorate([
    (0, rest_1.get)('/menus/{id}'),
    (0, rest_1.response)(200, {
        description: 'Menus model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Menus, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.Menus, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/menus/{id}'),
    (0, rest_1.response)(204, {
        description: 'Menus PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Menus, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Menus]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/menus/{id}'),
    (0, rest_1.response)(204, {
        description: 'Menus PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Menus]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/menus/{id}'),
    (0, rest_1.response)(204, {
        description: 'Menus DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MenusController.prototype, "deleteById", null);
MenusController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.MenusRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.AdminUsersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.RolesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MenusRepository,
        repositories_1.AdminUsersRepository,
        repositories_1.RolesRepository])
], MenusController);
exports.MenusController = MenusController;
//# sourceMappingURL=menus.controller.js.map