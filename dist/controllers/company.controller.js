"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
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
let CompanyController = class CompanyController {
    constructor(companyRepository, jwtService, userService, serviceOrdersRepository, servicesRepository, serviceProviderRepository) {
        this.companyRepository = companyRepository;
        this.jwtService = jwtService;
        this.userService = userService;
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.servicesRepository = servicesRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.AccCreateEmails = new utils_1.AccCreateEmails();
    }
    async login(credentials) {
        // ensure the user exists, and the password is correct
        const result = {
            code: 5,
            msg: 'Invalid email or password.',
            token: '',
            company: {},
        };
        try {
            const filter = {
                where: { email: credentials.email },
                include: [{ relation: 'userCreds' }],
            };
            const dbCompany = await this.companyRepository.findOne(filter);
            //const user = await this.userService.verifyCredentials(credentials);
            if ((dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.status) !== "S") {
                if (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.userCreds) {
                    const salt = dbCompany.userCreds.salt;
                    const password = await (0, bcryptjs_1.hash)(credentials.password, salt);
                    if (password === dbCompany.userCreds.password) {
                        // create a JSON Web Token based on the user profile
                        result.token = await this.jwtService.generateToken(this.userService.convertToUserProfile(dbCompany));
                        dbCompany.userCreds = new models_1.UserCreds();
                        result.company = dbCompany;
                        result.code = 0;
                        result.msg = 'Logged in successfully.';
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
    async create(company) {
        const result = {
            code: 5,
            msg: 'Some error occurred.',
            company: {},
            token: '',
        };
        try {
            const filter = { where: { email: company.email } };
            const dbCompany = await this.companyRepository.findOne(filter);
            if (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.id) {
                result.code = 5;
                result.msg = 'Company already exists.';
            }
            else {
                if (company.password && company.bankAccountInfo) {
                    const salt = await (0, bcryptjs_1.genSalt)();
                    const password = await (0, bcryptjs_1.hash)(company.password, salt);
                    const savedCompany = await this.companyRepository.create(lodash_1.default.omit(company, 'password', 'bankAccountInfo'));
                    if (savedCompany) {
                        await this.companyRepository
                            .userCreds(savedCompany.id)
                            .create({ password, salt });
                        await this.companyRepository
                            .account(savedCompany.id)
                            .create({ balanceAmount: 0 });
                        savedCompany.bankAccount = await this.companyRepository
                            .bankAccount(savedCompany.id)
                            .create(company.bankAccountInfo);
                        result.company = savedCompany;
                        result.code = 0;
                        result.msg = 'Company registered successfully.';
                        await this.AccCreateEmails.sendCompanyAccCreateMail(savedCompany, company);
                    }
                }
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async changePassword(credentialsRequest) {
        const result = { code: 5, msg: 'Change password failed.' };
        if ((credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.id) &&
            (credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.password) &&
            (credentialsRequest === null || credentialsRequest === void 0 ? void 0 : credentialsRequest.oldPassword)) {
            const dbCompany = await this.companyRepository.findOne({
                where: { id: credentialsRequest.id },
                include: [{ relation: 'userCreds' }],
            });
            if (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.userCreds) {
                let salt = dbCompany.userCreds.salt;
                let password = await (0, bcryptjs_1.hash)(credentialsRequest.oldPassword, salt);
                if (password === dbCompany.userCreds.password) {
                    salt = await (0, bcryptjs_1.genSalt)();
                    password = await (0, bcryptjs_1.hash)(credentialsRequest.password, salt);
                    const updatedAt = new Date();
                    await this.companyRepository
                        .userCreds(dbCompany.id)
                        .patch({ password, salt, updatedAt });
                    result.code = 0;
                    result.msg = 'Password has been changed successfully.';
                }
            }
        }
        return JSON.stringify(result);
    }
    async find(filter) {
        const result = { code: 5, msg: 'Some error occurred.', companies: {} };
        try {
            const comapnaies = await this.companyRepository.find(filter);
            if ((comapnaies === null || comapnaies === void 0 ? void 0 : comapnaies.length) > 0) {
                comapnaies.forEach((company) => {
                    var _a;
                    company.totalRiders = (_a = company === null || company === void 0 ? void 0 : company.serviceProviders) === null || _a === void 0 ? void 0 : _a.length;
                });
            }
            result.companies = comapnaies;
            result.code = 0;
            result.msg = 'Companies fetched successfully.';
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async findById(id) {
        const result = {
            code: 5,
            msg: 'Some error occurred.',
            company: {},
            token: '',
        };
        try {
            const dbCompany = await this.companyRepository.findOne({
                where: { id: id },
                include: [{ relation: 'bankAccount' }],
            });
            if (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.id) {
                dbCompany.bankAccountInfo = dbCompany.bankAccount;
                dbCompany.bankAccount = new models_1.BankAccount();
                result.company = dbCompany;
                result.code = 0;
                result.msg = 'Company fetched successfully.';
            }
            else {
                result.code = 5;
                result.msg = 'Company does not exists.';
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async updateById(id, company) {
        const result = {
            code: 5,
            msg: 'Some error occurred.',
            company: {},
            token: '',
        };
        try {
            let dbCompany = await this.companyRepository.findOne({
                where: { id: id },
                include: [{ relation: 'userCreds' }],
            });
            if (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.id) {
                if (company.password && (dbCompany === null || dbCompany === void 0 ? void 0 : dbCompany.userCreds)) {
                    const password = await (0, bcryptjs_1.hash)(company.password, dbCompany.userCreds.salt);
                    await this.companyRepository.userCreds(company.id).patch({ password });
                }
                await this.companyRepository
                    .bankAccount(company.id)
                    .patch(company.bankAccountInfo);
                await this.companyRepository.updateById(id, lodash_1.default.omit(company, 'password', 'email', 'bankAccountInfo'));
                dbCompany = await this.companyRepository.findOne({
                    where: { id: id, email: company.email },
                    include: [{ relation: 'bankAccount' }],
                });
                if (dbCompany) {
                    result.company = dbCompany;
                    result.code = 0;
                    result.msg = 'Company updated successfully.';
                }
            }
            else {
                result.code = 5;
                result.msg = 'Company does not exists.';
            }
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async findCompanyServiceProviders(companyId, filter) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting serviceProviders.',
            serviceProviders: {},
        };
        try {
            const dbCompany = await this.companyRepository.findById(companyId);
            if (dbCompany) {
                if (filter) {
                    filter.where = {
                        ...filter.where,
                        companyId: companyId,
                        serviceProviderType: dbCompany.companyType,
                    };
                    if (filter.limit && filter.limit > 50) {
                        filter = { ...filter, limit: 50 };
                    }
                }
                else {
                    filter = {
                        where: {
                            companyId: companyId,
                            serviceProviderType: dbCompany.companyType,
                        },
                        limit: 50,
                    };
                }
                const serviceProviders = await this.serviceProviderRepository.find(filter);
                result = {
                    code: 0,
                    msg: 'ServiceProviders fetched successfully.',
                    serviceProviders: serviceProviders,
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
    async findCompanyOrders(companyId, filter) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting orders.',
            orders: {},
        };
        try {
            const dbCompany = await this.companyRepository.findById(companyId);
            if (dbCompany) {
                const serviceIdArray = await this.getServiceIdArrayForOrder(dbCompany.companyType);
                if ((serviceIdArray === null || serviceIdArray === void 0 ? void 0 : serviceIdArray.length) > 0) {
                    if (filter) {
                        filter.where = {
                            ...filter.where,
                            companyId: companyId,
                            serviceId: { inq: serviceIdArray },
                        };
                    }
                    else {
                        filter = {
                            where: {
                                companyId: companyId,
                                serviceId: { inq: serviceIdArray },
                            },
                        };
                    }
                    const orders = await this.serviceOrdersRepository.find(filter);
                    result = {
                        code: 0,
                        msg: 'Orders fetched successfully.',
                        orders: orders,
                    };
                }
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async getServiceIdArrayForOrder(companyType) {
        const requiredServiceTypeArray = [];
        let serviceArray = [];
        if (companyType === 'DFY') {
            requiredServiceTypeArray.push('Done For You');
        }
        else if (companyType === 'SP') {
            requiredServiceTypeArray.push('General Assistance');
            requiredServiceTypeArray.push('Car Tow');
        }
        if (requiredServiceTypeArray.length > 0) {
            serviceArray = await this.servicesRepository.find({
                where: { serviceType: { inq: requiredServiceTypeArray } },
                fields: ['serviceId'],
            });
        }
        return serviceArray.length > 0
            ? serviceArray.map(service => service.serviceId)
            : [];
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/companies/login', {
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
], CompanyController.prototype, "login", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/createCompany'),
    (0, rest_1.response)(200, {
        description: 'Company model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.Company) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Company, {
                    title: 'NewCompany',
                    exclude: ['id'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/changePassword', {
        responses: {
            '200': {
                description: 'User',
                content: 'ChangePasswordRequest',
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)(models_1.CredentialsRequestBody)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.CredentialsRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "changePassword", null);
tslib_1.__decorate([
    (0, rest_1.get)('/companies/getCompanies'),
    (0, rest_1.response)(200, {
        description: 'Array of Company model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Company, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.filter(models_1.Company)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/companies/getCompanyDetails/{id}'),
    (0, rest_1.response)(200, {
        description: 'Company model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Company, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/companies/updateCompany/{id}'),
    (0, rest_1.response)(200, {
        description: 'Company PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.Company, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.Company]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.get)('/companies/getServiceProviders/{companyId}'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceOrders model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('companyId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceProvider)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "findCompanyServiceProviders", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.get)('/companies/getOrders/{companyId}'),
    (0, rest_1.response)(200, {
        description: 'Array of ServiceOrders model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('companyId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], CompanyController.prototype, "findCompanyOrders", null);
CompanyController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_jwt_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(2, (0, core_1.inject)(authentication_jwt_1.UserServiceBindings.USER_SERVICE)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.CompanyRepository, Object, authentication_jwt_1.MyUserService,
        repositories_1.ServiceOrdersRepository,
        repositories_1.ServicesRepository,
        repositories_1.ServiceProviderRepository])
], CompanyController);
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map