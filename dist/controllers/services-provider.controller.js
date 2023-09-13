"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesProviderController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const authentication_jwt_1 = require("@loopback/authentication-jwt");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const bcryptjs_1 = require("bcryptjs");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
let ServicesProviderController = class ServicesProviderController {
    constructor(jwtService, userService, serviceProviderServicesRepository, servicesRepository, serviceProviderRepository) {
        this.jwtService = jwtService;
        this.userService = userService;
        this.serviceProviderServicesRepository = serviceProviderServicesRepository;
        this.servicesRepository = servicesRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.AccCreateEmails = new utils_1.AccCreateEmails();
    }
    async signUp(serviceProvider) {
        let result = {
            code: 5,
            msg: 'User registration failed.',
            token: '',
            userId: '',
        };
        try {
            if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(serviceProvider.email)) {
                const user = await this.serviceProviderRepository.findOne({
                    where: { email: serviceProvider.email, roleId: 'SERVICEPROVIDER' },
                });
                if (user === null || user === void 0 ? void 0 : user.id) {
                    result = { code: 5, msg: 'User already exists', token: '', userId: '' };
                }
                else {
                    const salt = await (0, bcryptjs_1.genSalt)();
                    const password = await (0, bcryptjs_1.hash)(serviceProvider.password, salt);
                    serviceProvider.roleId = 'SERVICEPROVIDER';
                    serviceProvider.isServiceProviderVerified = 'N';
                    const savedUser = await this.serviceProviderRepository.create(lodash_1.default.omit(serviceProvider, 'password'));
                    if (savedUser) {
                        await this.serviceProviderRepository
                            .account(savedUser.id)
                            .create({ balanceAmount: 0 });
                        await this.serviceProviderRepository
                            .userCreds(savedUser.id)
                            .create({ password, salt });
                        const userProfile = this.userService.convertToUserProfile(savedUser);
                        result.userId = savedUser.id;
                        // create a JSON Web Token based on the user profile
                        result.token = await this.jwtService.generateToken(userProfile);
                        result.code = 0;
                        result.msg = 'User registered successfully.';
                    }
                }
            }
            else {
                result.msg = 'Enter valid email.';
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async createServiceProviderByAdmin(serviceProvider) {
        var _a;
        let result = { code: 5, msg: 'User registration failed.', user: {} };
        try {
            if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(serviceProvider.email)) {
                const user = await this.serviceProviderRepository.findOne({
                    where: { email: serviceProvider.email, roleId: 'SERVICEPROVIDER' },
                });
                if (user === null || user === void 0 ? void 0 : user.id) {
                    result = { code: 5, msg: 'User already exists', user: {} };
                }
                else {
                    const salt = await (0, bcryptjs_1.genSalt)();
                    const password = await (0, bcryptjs_1.hash)(serviceProvider.password, salt);
                    serviceProvider.roleId = 'SERVICEPROVIDER';
                    serviceProvider.isServiceProviderVerified = 'N';
                    const savedUser = await this.serviceProviderRepository.create(lodash_1.default.omit(serviceProvider, 'password', 'serviceProviderServicesList'));
                    if (savedUser) {
                        await this.serviceProviderRepository
                            .account(savedUser.id)
                            .create({ balanceAmount: 0 });
                        await this.serviceProviderRepository
                            .userCreds(savedUser.id)
                            .create({ password, salt });
                        const servicesArray = [];
                        const serviceProviderServiceMap = new Map();
                        if (Array.isArray(serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.serviceProviderServicesList) &&
                            ((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.serviceProviderServicesList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                            serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.serviceProviderServicesList.forEach((serviceProviderService) => {
                                if (serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId) {
                                    servicesArray.push(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId);
                                    serviceProviderServiceMap.set(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId, serviceProviderService);
                                }
                            });
                            serviceProvider.serviceProviderServicesList = [];
                            const finalServicesArray = await this.checkServicesExist(servicesArray);
                            const serviceProviderServicesList = [];
                            for (const finalService of finalServicesArray) {
                                const serviceProviderServices = serviceProviderServiceMap.get(finalService.serviceId + '');
                                if ((serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId) && savedUser.id) {
                                    const serviceProviderServiceArray = await this.checkServiceProviderServiceExist(serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId, savedUser.id);
                                    if (!serviceProviderServiceArray ||
                                        (serviceProviderServiceArray === null || serviceProviderServiceArray === void 0 ? void 0 : serviceProviderServiceArray.length) === 0) {
                                        const serviceProviderServiceObject = new models_1.ServiceProviderServices();
                                        serviceProviderServiceObject.serviceId =
                                            serviceProviderServices.serviceId;
                                        serviceProviderServiceObject.isActive =
                                            serviceProviderServices.isActive;
                                        serviceProviderServiceObject.userId = savedUser.id;
                                        serviceProviderServiceObject.serviceName =
                                            finalService.serviceName;
                                        serviceProviderServiceObject.serviceType =
                                            finalService.serviceType;
                                        serviceProviderServiceObject.vehicleType =
                                            finalService.vehicleType;
                                        serviceProviderServiceObject.accidental =
                                            finalService.accidental;
                                        serviceProviderServicesList.push(await this.serviceProviderServicesRepository.create(serviceProviderServiceObject));
                                    }
                                }
                            }
                            savedUser.serviceProviderServicesList =
                                serviceProviderServicesList;
                        }
                        result.code = 0;
                        result.msg = 'Service provider created successfully.';
                        result.user = savedUser;
                        await this.AccCreateEmails.sendRiderAccCreateMail(savedUser, serviceProvider);
                    }
                }
            }
            else {
                result.msg = 'Enter valid email.';
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = 'Some error occurred.';
        }
        return JSON.stringify(result);
    }
    async updateServiceProviderByAdmin(serviceProvider) {
        var _a;
        let result = {
            code: 5,
            msg: 'Some error occurred while updating service provider.',
            user: {},
        };
        try {
            await this.serviceProviderRepository.updateById(serviceProvider.id, lodash_1.default.omit(serviceProvider, 'password', 'serviceProviderServicesList'));
            const user = await this.serviceProviderRepository.findById(serviceProvider.id, {});
            if (user) {
                const servicesArray = [];
                const serviceProviderServiceMap = new Map();
                if (Array.isArray(serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.serviceProviderServicesList) &&
                    ((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.serviceProviderServicesList) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                    serviceProvider.serviceProviderServicesList.forEach((serviceProviderService) => {
                        if (serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId) {
                            servicesArray.push(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId);
                            serviceProviderServiceMap.set(serviceProviderService === null || serviceProviderService === void 0 ? void 0 : serviceProviderService.serviceId, serviceProviderService);
                        }
                    });
                    serviceProvider.serviceProviderServicesList = [];
                    const finalServicesArray = await this.checkServicesExist(servicesArray);
                    const serviceProviderServicesList = [];
                    for (const finalService of finalServicesArray) {
                        const serviceProviderServices = serviceProviderServiceMap.get(finalService.serviceId + '');
                        if ((serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId) && user.id) {
                            const serviceProviderServiceArray = await this.checkServiceProviderServiceExist(serviceProviderServices === null || serviceProviderServices === void 0 ? void 0 : serviceProviderServices.serviceId, user.id);
                            if (!serviceProviderServiceArray ||
                                (serviceProviderServiceArray === null || serviceProviderServiceArray === void 0 ? void 0 : serviceProviderServiceArray.length) === 0) {
                                const serviceProviderServiceObject = new models_1.ServiceProviderServices();
                                serviceProviderServiceObject.serviceId =
                                    serviceProviderServices.serviceId;
                                serviceProviderServiceObject.isActive =
                                    serviceProviderServices.isActive;
                                serviceProviderServiceObject.userId = user.id;
                                serviceProviderServiceObject.serviceName =
                                    finalService.serviceName;
                                serviceProviderServiceObject.serviceType =
                                    finalService.serviceType;
                                serviceProviderServiceObject.vehicleType =
                                    finalService.vehicleType;
                                serviceProviderServiceObject.accidental =
                                    finalService.accidental;
                                serviceProviderServicesList.push(await this.serviceProviderServicesRepository.create(serviceProviderServiceObject));
                            }
                            else if ((serviceProviderServiceArray === null || serviceProviderServiceArray === void 0 ? void 0 : serviceProviderServiceArray.length) > 0) {
                                serviceProviderServices.updatedAt = new Date();
                                await this.serviceProviderServicesRepository.updateById(serviceProviderServices.id, serviceProviderServices);
                                serviceProviderServicesList.push(await this.serviceProviderServicesRepository.findById(serviceProviderServices.id));
                            }
                        }
                    }
                    user.serviceProviderServicesList = serviceProviderServicesList;
                }
                result = {
                    code: 0,
                    msg: 'Service provider updated successfully.',
                    user: user,
                };
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async checkServicesExist(servicesArray) {
        return this.servicesRepository.find({
            where: { serviceId: { inq: servicesArray } },
            fields: ['serviceId', 'serviceName', 'serviceType', 'vehicleType'],
        });
    }
    async checkServiceProviderServiceExist(serviceId, userId) {
        return this.serviceProviderServicesRepository.find({
            where: { serviceId: serviceId, userId: userId },
            fields: ['serviceId'],
        });
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
            const user = await this.serviceProviderRepository.findOne({
                where: { email: credentials.email, roleId: 'SERVICEPROVIDER' },
                include: [{ relation: 'userCreds' }],
            });
            //const user = await this.userService.verifyCredentials(credentials);
            if ((user === null || user === void 0 ? void 0 : user.userStatus) !== "S") {
                if (user === null || user === void 0 ? void 0 : user.userCreds) {
                    const salt = user.userCreds.salt;
                    const password = await (0, bcryptjs_1.hash)(credentials.password, salt);
                    if (password === user.userCreds.password) {
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
            console.log(e);
            result.code = 5;
            result.msg = "Some error occurred";
        }
        return JSON.stringify(result);
    }
    async resetPassword(newUserRequest) {
        const result = { code: 5, msg: 'Reset password failed.' };
        const user = await this.serviceProviderRepository.findOne({
            where: { email: newUserRequest.email, roleId: 'SERVICEPROVIDER' },
        });
        if (user) {
            const salt = await (0, bcryptjs_1.genSalt)();
            const password = await (0, bcryptjs_1.hash)(newUserRequest.password, salt);
            const updatedAt = new Date();
            await this.serviceProviderRepository
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
            const user = await this.serviceProviderRepository.findOne({
                where: { id: credentialsRequest.id, roleId: 'SERVICEPROVIDER' },
                include: [{ relation: 'userCreds' }],
            });
            if (user === null || user === void 0 ? void 0 : user.userCreds) {
                let salt = user.userCreds.salt;
                let password = await (0, bcryptjs_1.hash)(credentialsRequest.oldPassword, salt);
                if (password === user.userCreds.password) {
                    salt = await (0, bcryptjs_1.genSalt)();
                    password = await (0, bcryptjs_1.hash)(credentialsRequest.password, salt);
                    const updatedAt = new Date();
                    await this.serviceProviderRepository
                        .userCreds(user.id)
                        .patch({ password, salt, updatedAt });
                    result.code = 0;
                    result.msg = 'Password has been changed successfully.';
                }
            }
        }
        return JSON.stringify(result);
    }
    async updateProfile(serviceProvider) {
        let result = {
            code: 5,
            msg: 'Some error occurred while updating profile.',
            user: {},
        };
        try {
            await this.serviceProviderRepository.updateById(serviceProvider.id, lodash_1.default.omit(serviceProvider, 'email', 'phoneNo'));
            const user = await this.serviceProviderRepository.findById(serviceProvider.id, {});
            if (user) {
                result = {
                    code: 0,
                    msg: 'User profile updated successfully.',
                    user: user,
                };
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async updateEndpoint(newUserRequest) {
        await this.serviceProviderRepository.updateById(newUserRequest.id, lodash_1.default.pick(newUserRequest, 'endpoint'));
        const user = await this.serviceProviderRepository.findById(newUserRequest.id, {});
        const result = { code: 0, msg: 'Endpoint updated successfully.', user: user };
        return JSON.stringify(result);
    }
    async approveServiceProvider(newUserRequest) {
        await this.serviceProviderRepository.updateById(newUserRequest.id, {
            userStatus: 'A',
        });
        await this.serviceProviderRepository
            .userDocs(newUserRequest.id)
            .patch({ docStatus: 'A' }, { docType: { inq: ['DL', 'VR', 'VFC', 'CPR', 'RL1', 'RL2'] } });
        const user = await this.serviceProviderRepository.findById(newUserRequest.id, {});
        const result = { code: 0, msg: 'User approved successfully.', user: user };
        return JSON.stringify(result);
    }
    async fetchAllPendingServiceProviders(filter) {
        return this.serviceProviderRepository.find({
            where: { roleId: 'SERVICEPROVIDER', userStatus: 'P' },
        });
    }
    async findByEmail(email) {
        return this.serviceProviderRepository.find({
            where: { roleId: 'SERVICEPROVIDER', email: { like: email } },
            limit: 10,
            fields: ['id', 'email'],
        });
    }
    async logoutServiceProvider(newUserRequest) {
        await this.serviceProviderRepository.updateById(newUserRequest.id, {
            endpoint: '',
        });
        const result = { code: 0, msg: 'User logged out successfully.' };
        return JSON.stringify(result);
    }
    async create(serviceProvider) {
        return this.serviceProviderRepository.create(serviceProvider);
    }
    async count(where) {
        return this.serviceProviderRepository.count(where);
    }
    async find(filter) {
        return this.serviceProviderRepository.find(filter);
    }
    async findById(id, filter) {
        return this.serviceProviderRepository.findById(id, filter);
    }
    async updateById(id, appUsers) {
        await this.serviceProviderRepository.updateById(id, appUsers);
    }
    async replaceById(id, appUsers) {
        await this.serviceProviderRepository.replaceById(id, appUsers);
    }
    async deleteById(id) {
        await this.serviceProviderRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider/signup'),
    (0, rest_1.response)(200, {
        description: 'AppUsers model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'serviceProvider',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "signUp", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider/admin/createServiceProvider'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'serviceProvider',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "createServiceProviderByAdmin", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/serviceProvider/admin/updateServiceProvider'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "updateServiceProviderByAdmin", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider/login', {
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
], ServicesProviderController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider/resetPassword', {
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
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "resetPassword", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider/changePassword', {
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
], ServicesProviderController.prototype, "changePassword", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/serviceProvider/updateProfile'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "updateProfile", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/serviceProvider/updateEndpoint', {
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
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "updateEndpoint", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/serviceProvider/approveServiceProvider', {
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
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "approveServiceProvider", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProvider/adminUser/fetchAllPendingServiceProviders'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceProvider model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.ServiceProvider)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "fetchAllPendingServiceProviders", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProvider/getSearchedUsers/{email}'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceProvider model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "findByEmail", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/serviceProvider/logoutServiceProvider', {
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
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewUser',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "logoutServiceProvider", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceProvider'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, {
                    title: 'NewServiceProvider',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProvider/count'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.ServiceProvider)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProvider'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceProvider model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.ServiceProvider)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceProvider/{id}'),
    (0, rest_1.response)(200, {
        description: 'ServiceProvider model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceProvider, { exclude: 'where' })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/serviceProvider/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProvider PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceProvider, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/serviceProvider/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProvider PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceProvider]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/serviceProvider/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceProvider DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServicesProviderController.prototype, "deleteById", null);
ServicesProviderController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.ServiceProviderServicesRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [Object, authentication_jwt_1.MyUserService,
        repositories_1.ServiceProviderServicesRepository,
        repositories_1.ServicesRepository,
        repositories_1.ServiceProviderRepository])
], ServicesProviderController);
exports.ServicesProviderController = ServicesProviderController;
//# sourceMappingURL=services-provider.controller.js.map