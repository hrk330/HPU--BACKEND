"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppUserController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const bcryptjs_1 = require("bcryptjs");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
let AppUserController = class AppUserController {
    constructor(appUsersRepository, jwtService, userService, verificationCodesRepository, serviceOrdersRepository) {
        this.appUsersRepository = appUsersRepository;
        this.jwtService = jwtService;
        this.userService = userService;
        this.verificationCodesRepository = verificationCodesRepository;
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.AccCreateEmails = new utils_1.AccCreateEmails();
    }
    async whoAmI(currentUserProfile) {
        console.log(currentUserProfile);
        return currentUserProfile[security_1.securityId];
    }
    async login(credentials) {
        // ensure the user exists, and the password is correct
        const result = {
            code: 5,
            msg: 'Invalid email or password.',
            token: '',
            user: {},
        };
        try {
            const user = await this.appUsersRepository.findOne({
                where: { email: credentials.email, roleId: 'APPUSER' },
                include: [{ relation: 'userCreds' }],
            });
            //const user = await this.userService.verifyCredentials(credentials);
            if ((user === null || user === void 0 ? void 0 : user.userStatus) !== 'S') {
                if (user === null || user === void 0 ? void 0 : user.userCreds) {
                    const salt = user.userCreds.salt;
                    const password = await (0, bcryptjs_1.hash)(credentials.password, salt);
                    if (password === user.userCreds.password) {
                        //this.appUsersRepository.updateById(id, appUsers)
                        // convert a User object into a UserProfile object (reduced set of properties)
                        // create a JSON Web Token based on the user profile
                        result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
                        user.userCreds = new models_1.UserCreds();
                        result.user = user;
                        result.code = 0;
                        result.msg = 'User logged in successfully.';
                    }
                }
            }
            else {
                result.msg = 'User suspended.';
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async signUp(newUserRequest) {
        let result = {
            code: 5,
            msg: 'User registeration failed.',
            token: '',
            userId: '',
        };
        try {
            const filter = { where: { email: newUserRequest.email, roleId: 'APPUSER' } };
            const user = await this.appUsersRepository.findOne(filter);
            if (user === null || user === void 0 ? void 0 : user.id) {
                result = { code: 5, msg: 'User already exists', token: '', userId: '' };
            }
            else {
                const salt = await (0, bcryptjs_1.genSalt)();
                const password = await (0, bcryptjs_1.hash)(newUserRequest.password, salt);
                newUserRequest.roleId = 'APPUSER';
                const savedUser = await this.appUsersRepository.create(lodash_1.default.omit(newUserRequest, 'password'));
                if (savedUser) {
                    await this.appUsersRepository
                        .userCreds(savedUser.id)
                        .create({ password, salt });
                    await this.appUsersRepository
                        .account(savedUser.id)
                        .create({ balanceAmount: 0 });
                    const userProfile = this.userService.convertToUserProfile(savedUser);
                    result.userId = savedUser.id;
                    // create a JSON Web Token based on the user profile
                    result.token = await this.jwtService.generateToken(userProfile);
                    result.code = 0;
                    result.msg = 'User registered successfully.';
                }
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async socialSignUp(newUserRequest) {
        const filter = {
            where: {
                socialId: newUserRequest.socialId,
                socialIdType: newUserRequest.socialIdType,
                roleId: 'APPUSER',
            },
        };
        const user = await this.appUsersRepository.findOne(filter);
        let result = {
            code: 0,
            msg: 'User registered successfully.',
            token: '',
            userId: '',
        };
        if (user) {
            result = { code: 5, msg: 'User already exists', token: '', userId: '' };
        }
        else {
            newUserRequest.roleId = 'APPUSER';
            const savedUser = await this.appUsersRepository.create(newUserRequest);
            if (savedUser) {
                await this.appUsersRepository
                    .account(savedUser.id)
                    .create({ balanceAmount: 0 });
            }
            const userProfile = this.userService.convertToUserProfile(savedUser);
            result.userId = savedUser.id;
            // create a JSON Web Token based on the user profile
            result.token = await this.jwtService.generateToken(userProfile);
        }
        return JSON.stringify(result);
    }
    async socialLogin(newUserRequest) {
        // ensure the user exists, and the password is correct
        const result = { code: 5, msg: 'Invalid Login.', token: '', user: {} };
        try {
            const filter = {
                where: {
                    socialId: newUserRequest.socialId,
                    socialIdType: newUserRequest.socialIdType,
                    roleId: 'APPUSER',
                },
            };
            const user = await this.appUsersRepository.findOne(filter);
            if (user) {
                if ((user === null || user === void 0 ? void 0 : user.userStatus) !== 'S') {
                    //this.appUsersRepository.updateById(id, appUsers)
                    // convert a User object into a UserProfile object (reduced set of properties)
                    // create a JSON Web Token based on the user profile
                    result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(user));
                    result.user = user;
                    result.code = 0;
                    result.msg = 'User logged in successfully';
                }
                else {
                    result.msg = 'User suspended';
                }
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async updateProfile(newUserRequest) {
        await this.appUsersRepository.updateById(newUserRequest.id, lodash_1.default.omit(newUserRequest, 'email'));
        const user = await this.appUsersRepository.findById(newUserRequest.id, {});
        const result = {
            code: 0,
            msg: 'User profile updated successfully.',
            user: user,
        };
        return JSON.stringify(result);
    }
    async updateEndpoint(newUserRequest) {
        await this.appUsersRepository.updateById(newUserRequest.id, lodash_1.default.pick(newUserRequest, 'endpoint'));
        const user = await this.appUsersRepository.findById(newUserRequest.id, {});
        const result = {
            code: 0,
            msg: 'User profile updated successfully.',
            user: user,
        };
        return JSON.stringify(result);
    }
    async logoutAppUser(newUserRequest) {
        await this.appUsersRepository.updateById(newUserRequest.id, { endpoint: '' });
        const result = { code: 0, msg: 'User logged out successfully.' };
        return JSON.stringify(result);
    }
    async resetPassword(newUserRequest) {
        const result = { code: 5, msg: 'Reset password failed.' };
        const filter = { where: { email: newUserRequest.email, roleId: 'APPUSER' } };
        const user = await this.appUsersRepository.findOne(filter);
        if (user) {
            const salt = await (0, bcryptjs_1.genSalt)();
            const password = await (0, bcryptjs_1.hash)(newUserRequest.password, salt);
            const updatedAt = new Date();
            await this.appUsersRepository
                .userCreds(user.id)
                .patch({ password, salt, updatedAt });
            result.code = 0;
            result.msg = 'Password has been reset successfully.';
        }
        return JSON.stringify(result);
    }
    async changePassword(credentialsRequest) {
        const result = { code: 5, msg: 'Change password failed.' };
        if ((credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.id) &&
            (credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.password) &&
            (credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.oldPassword)) {
            const user = await this.appUsersRepository.findOne({
                where: { id: credentialsRequest.id, roleId: 'APPUSER' },
                include: [{ relation: 'userCreds' }],
            });
            if (user === null || user === void 0 ? void 0 : user.userCreds) {
                let salt = user.userCreds.salt;
                let password = await (0, bcryptjs_1.hash)(credentialsRequest.oldPassword, salt);
                if (password === user.userCreds.password) {
                    salt = await (0, bcryptjs_1.genSalt)();
                    password = await (0, bcryptjs_1.hash)(credentialsRequest.password, salt);
                    const updatedAt = new Date();
                    await this.appUsersRepository
                        .userCreds(user.id)
                        .patch({ password, salt, updatedAt });
                    result.code = 0;
                    result.msg = 'Password has been changed successfully.';
                }
            }
        }
        return JSON.stringify(result);
    }
    async count(where) {
        return this.appUsersRepository.count(where);
    }
    async findByEmail(email) {
        return this.appUsersRepository.find({
            where: { roleId: 'APPUSER', email: { like: email } },
            limit: 10,
            fields: ['id', 'email'],
        });
    }
    async adminCreateAppUser(newUserRequest) {
        let result = {
            code: 5,
            msg: 'User creation failed.',
            user: {},
        };
        try {
            const filter = { where: { email: newUserRequest.email, roleId: 'APPUSER' } };
            const user = await this.appUsersRepository.findOne(filter);
            if (user === null || user === void 0 ? void 0 : user.id) {
                result = { code: 5, msg: 'User already exists', user: {} };
            }
            else {
                const salt = await (0, bcryptjs_1.genSalt)();
                const password = await (0, bcryptjs_1.hash)(newUserRequest.password, salt);
                newUserRequest.roleId = 'APPUSER';
                const savedUser = await this.appUsersRepository.create(lodash_1.default.omit(newUserRequest, 'password'));
                if (savedUser) {
                    await this.appUsersRepository
                        .userCreds(savedUser.id)
                        .create({ password, salt });
                    await this.appUsersRepository
                        .account(savedUser.id)
                        .create({ balanceAmount: 0 });
                    result.user = savedUser;
                    // create a JSON Web Token based on the user profile
                    result.code = 0;
                    result.msg = 'User created successfully.';
                }
                await this.AccCreateEmails.sendUserAccCreateByAdminEmail(savedUser, newUserRequest);
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async adminUpdateAppUser(newUserRequest) {
        let result = {
            code: 5,
            msg: 'User update failed.',
            user: {},
        };
        try {
            await this.appUsersRepository.updateById(newUserRequest.id, lodash_1.default.omit(newUserRequest, 'email', 'password'));
            const user = await this.appUsersRepository.findById(newUserRequest.id, {});
            result = {
                code: 0,
                msg: 'User updated successfully.',
                user: user,
            };
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred while updating user';
        }
        return JSON.stringify(result);
    }
    async find(filter) {
        return this.appUsersRepository.find(filter);
    }
    async findById(id, filter) {
        const orders = await this.serviceOrdersRepository.find({
            where: { userId: id },
        });
        const appuser = await this.appUsersRepository.findById(id, filter);
        if ((orders === null || orders === void 0 ? void 0 : orders.length) > 0) {
            appuser.totalOrders = orders === null || orders === void 0 ? void 0 : orders.length;
        }
        return appuser;
    }
    async updateById(id, appUsers) {
        await this.appUsersRepository.updateById(id, appUsers);
    }
    async replaceById(id, appUsers) {
        await this.appUsersRepository.replaceById(id, appUsers);
    }
    async deleteById(id) {
        await this.appUsersRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.get)('/whoAmI', {
        responses: {
            '200': {
                description: 'Return current user',
                content: {
                    'application/json': {
                        schema: {
                            type: 'string',
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, core_1.inject)(security_1.SecurityBindings.USER)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "whoAmI", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/login', {
        responses: {
            '200': {
                description: 'Token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)(models_1.CredentialsRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.CredentialsRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/signup', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "signUp", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/socialSignUp', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "socialSignUp", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/socialLogin', {
        responses: {
            '200': {
                description: 'Token',
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                token: {
                                    type: 'string',
                                },
                            },
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "socialLogin", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/appUsers/updateProfile', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "updateProfile", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/appUsers/updateEndpoint', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "updateEndpoint", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/appUsers/logoutAppUser', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "logoutAppUser", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/resetPassword', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "resetPassword", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/changePassword', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)(models_1.CredentialsRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.CredentialsRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "changePassword", null);
tslib_1.__decorate([
    (0, rest_1.get)('/appUsers/count'),
    (0, rest_1.response)(200, {
        description: 'AppUsers model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.AppUsers)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/appUsers/getSearchedUsers/{email}'),
    (0, rest_1.response)(200, {
        description: 'Array of AppUsers model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "findByEmail", null);
tslib_1.__decorate([
    (0, rest_1.post)('/appUsers/admin/createAppUser', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "adminCreateAppUser", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/appUsers/admin/updateAppUser', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: {
                            'x-ts-type': authentication_jwt_1.User,
                        },
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "adminUpdateAppUser", null);
tslib_1.__decorate([
    (0, rest_1.get)('/appUsers'),
    (0, rest_1.response)(200, {
        description: 'Array of AppUsers model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.AppUsers)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/appUsers/{id}'),
    (0, rest_1.response)(200, {
        description: 'AppUsers model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.AppUsers, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/appUsers/{id}'),
    (0, rest_1.response)(204, {
        description: 'AppUsers PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/appUsers/{id}'),
    (0, rest_1.response)(204, {
        description: 'AppUsers PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.AppUsers]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/appUsers/{id}'),
    (0, rest_1.response)(204, {
        description: 'AppUsers DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AppUserController.prototype, "deleteById", null);
AppUserController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(2, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.VerificationCodesRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.AppUsersRepository, Object, authentication_jwt_1.MyUserService,
        repositories_1.VerificationCodesRepository,
        repositories_1.ServiceOrdersRepository])
], AppUserController);
exports.AppUserController = AppUserController;
//# sourceMappingURL=app-user.controller.js.map