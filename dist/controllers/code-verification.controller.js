"use strict";
// Uncomment these imports to begin using these cool features!
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeVerificationController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const utils_1 = require("../utils");
// import {inject} from '@loopback/core';
let CodeVerificationController = class CodeVerificationController {
    constructor(verificationCodesRepository, appUsersRepository, serviceProviderRepository) {
        this.verificationCodesRepository = verificationCodesRepository;
        this.appUsersRepository = appUsersRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.AccCreateEmails = new utils_1.AccCreateEmails();
    }
    async verifyCodeForAppUser(verificationRequestObject) {
        let result = {
            code: 5,
            msg: 'Verification code was not verified.',
        };
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                result.code = 0;
                result.msg = 'Verification code has been verified.';
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async verifyCodeForServiceProvider(verificationRequestObject) {
        let result = {
            code: 5,
            msg: 'Verification code was not verified.',
        };
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                result.code = 0;
                result.msg = 'Verification code has been verified.';
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async verifyVerificationCode(verificationRequestObject) {
        const result = {
            code: 5,
            msg: 'Verification code was not verified.',
        };
        let verificationKey = '';
        if (verificationRequestObject.type === 'E') {
            verificationKey = verificationRequestObject.email;
        }
        else if (verificationRequestObject.type === 'U') {
            verificationKey = verificationRequestObject.userId;
        }
        const verificationCodeFilter = {
            where: {
                key: verificationKey,
                code: verificationRequestObject.verificationCode,
                type: verificationRequestObject.type,
                status: 'L',
            },
            order: ['createdAt desc'],
        };
        const verificationCodeObject = await this.verificationCodesRepository.findOne(verificationCodeFilter);
        if (verificationCodeObject) {
            const currentDateTime = new Date();
            if (verificationCodeObject.expiry &&
                currentDateTime < verificationCodeObject.expiry) {
                await this.verificationCodesRepository.updateById(verificationCodeObject.id, { status: 'V', lastTry: currentDateTime });
                result.code = 0;
                result.msg = 'Verification code has been verified.';
            }
            else {
                await this.verificationCodesRepository.updateById(verificationCodeObject.id, { status: 'E', lastTry: currentDateTime });
                result.code = 5;
                result.msg = 'Verification code has been expired.';
            }
        }
        return result;
    }
    async updatePhoneNumber(verificationRequestObject) {
        let result = {
            code: 5,
            msg: 'Code verification Failed.',
        };
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                let user = undefined;
                if (verificationRequestObject.userType === 'U') {
                    await this.appUsersRepository.updateById(verificationRequestObject.userId, lodash_1.default.pick(verificationRequestObject, 'phoneNo'));
                    user = await this.appUsersRepository.findById(verificationRequestObject.userId, {});
                }
                else if (verificationRequestObject.userType === 'S') {
                    await this.serviceProviderRepository.updateById(verificationRequestObject.userId, lodash_1.default.pick(verificationRequestObject, 'phoneNo'));
                    user = await this.serviceProviderRepository.findById(verificationRequestObject.userId, {});
                }
                result = {
                    code: 0,
                    msg: 'Mobile number updated successfully.',
                    user: user,
                };
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async verifyPhoneNumber(newUserRequest) {
        let result = {
            code: 5,
            msg: 'Code verification Failed.',
        };
        const verificationRequestObject = new models_1.VerificationRequestObject();
        verificationRequestObject.userId = newUserRequest.id;
        verificationRequestObject.type = 'U';
        verificationRequestObject.verificationCode =
            newUserRequest.verificationCode;
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                result = { code: 0, msg: 'Phone Number verified successfully.' };
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async verifyEmailAddress(newUserRequest) {
        let result = {
            code: 5,
            msg: 'Code verification Failed.',
        };
        const verificationRequestObject = new models_1.VerificationRequestObject();
        verificationRequestObject.email = newUserRequest.email;
        verificationRequestObject.type = 'E';
        verificationRequestObject.verificationCode =
            newUserRequest.verificationCode;
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                result.code = 0;
                result.msg = 'Email verified successfully.';
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async updateEmailAddress(newUserRequest) {
        let result = {
            code: 5,
            msg: 'Code verification Failed.',
        };
        const verificationRequestObject = new models_1.VerificationRequestObject();
        verificationRequestObject.userId = newUserRequest.id;
        verificationRequestObject.type = 'E';
        verificationRequestObject.verificationCode =
            newUserRequest.verificationCode;
        const codeVerificationResponse = await this.verifyVerificationCode(verificationRequestObject);
        if (codeVerificationResponse) {
            if (codeVerificationResponse.code === 0) {
                await this.appUsersRepository.updateById(newUserRequest.id, lodash_1.default.pick(newUserRequest, 'email'));
                const user = await this.appUsersRepository.findById(newUserRequest.id, {});
                result = {
                    code: 0,
                    msg: 'User profile updated successfully.',
                    user: user,
                };
            }
            else {
                result = codeVerificationResponse;
            }
        }
        return JSON.stringify(result);
    }
    async sendEmailCodeForAppUser(verificationRequestObject) {
        const user = await this.appUsersRepository.findOne({
            where: { email: verificationRequestObject.email, roleId: 'APPUSER' },
        });
        if (verificationRequestObject.email &&
            verificationRequestObject.type === 'SU') {
            await this.AccCreateEmails.sendUserAccCreateByAppVerificationEmail(verificationRequestObject);
        }
        if (verificationRequestObject.email &&
            verificationRequestObject.type === 'RP') {
            await this.AccCreateEmails.sendUserAccCreateByAppVerificationEmail(verificationRequestObject);
        }
        return JSON.stringify(await this.insertVerificationCode(user, verificationRequestObject, 'E'));
    }
    async sendEmailCodeForServiceProvider(verificationRequestObject) {
        const user = await this.serviceProviderRepository.findOne({
            where: {
                email: verificationRequestObject.email,
                roleId: 'SERVICEPROVIDER',
            },
        });
        return JSON.stringify(await this.insertVerificationCode(user, verificationRequestObject, 'E'));
    }
    async insertVerificationCode(user, verificationRequestObject, codeType) {
        var _a;
        const result = {
            code: 5,
            msg: 'Verification code not sent.',
        };
        const successMessage = 'Verification code sent successfully.';
        if ((verificationRequestObject === null || verificationRequestObject === void 0 ? void 0 : verificationRequestObject.type) === 'RP') {
            if (!(user === null || user === void 0 ? void 0 : user.id)) {
                result.code = 5;
                result.msg = 'User does not exits.';
            }
            else if ((user === null || user === void 0 ? void 0 : user.id) && ((_a = user === null || user === void 0 ? void 0 : user.socialId) === null || _a === void 0 ? void 0 : _a.length) > 0) {
                result.code = 5;
                result.msg =
                    'Reset password is not allowed for accounts signed up with social id.';
            }
            else {
                try {
                    await this.verificationCodesRepository.create({
                        key: verificationRequestObject.email,
                        code: await this.getRandomInt(999999),
                        type: codeType,
                        status: 'L',
                        expiry: (await this.addMinutes(new Date(), 15)).toString(),
                    });
                    // mailOptions.to = verificationRequestObject.email;
                    // mailOptions.text = "Your Verification Code is: " + verificationCode;
                    // console.log("before sending");
                    // const response = await transporter.sendMail(mailOptions);
                    // console.log(response)
                    result.code = 0;
                    result.msg = successMessage;
                }
                catch (e) {
                    result.code = 5;
                    result.msg = 'Some error occurred while sending verification code.';
                }
            }
        }
        else if ((verificationRequestObject === null || verificationRequestObject === void 0 ? void 0 : verificationRequestObject.type) === 'SU') {
            if (user === null || user === void 0 ? void 0 : user.id) {
                result.code = 5;
                result.msg = 'User already exits.';
            }
            else {
                try {
                    await this.verificationCodesRepository.create({
                        key: verificationRequestObject.email,
                        code: await this.getRandomInt(999999),
                        type: codeType,
                        status: 'L',
                        expiry: (await this.addMinutes(new Date(), 15)).toString(),
                    });
                    result.code = 0;
                    result.msg = successMessage;
                }
                catch (e) {
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return result;
    }
    async sendSmsCode(verificationRequestObject) {
        const result = {
            code: 5,
            msg: 'Verification code not sent.',
        };
        try {
            await this.verificationCodesRepository.create({
                key: verificationRequestObject.userId,
                code: await this.getRandomInt(999999),
                type: 'U',
                status: 'L',
                expiry: (await this.addMinutes(new Date(), 15)).toString(),
            });
            result.code = 0;
            result.msg = 'Verification code sent successfully.';
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async getRandomInt(max) {
        //return Math.floor(Math.random() * max).toString();
        return '1234';
    }
    async addMinutes(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/codeVerification/appUser/verifyCode', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: String,
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "verifyCodeForAppUser", null);
tslib_1.__decorate([
    (0, rest_1.post)('/codeVerification/serviceProvider/verifyCode', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: String,
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "verifyCodeForServiceProvider", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/codeVerification/updatePhoneNumber', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                            title: 'NewUser',
                        }),
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "updatePhoneNumber", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/codeVerification/verifyPhoneNumber', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                            title: 'NewUser',
                        }),
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
], CodeVerificationController.prototype, "verifyPhoneNumber", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/codeVerification/verifyEmailAddress', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                            title: 'NewUser',
                        }),
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
], CodeVerificationController.prototype, "verifyEmailAddress", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.post)('/codeVerification/updateEmailAddress', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.AppUsers, {
                            title: 'NewUser',
                        }),
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
], CodeVerificationController.prototype, "updateEmailAddress", null);
tslib_1.__decorate([
    (0, rest_1.post)('/codeVerification/appUser/sendEmailCode', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: String,
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "sendEmailCodeForAppUser", null);
tslib_1.__decorate([
    (0, rest_1.post)('/codeVerification/serviceProvider/sendEmailCode', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: String,
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "sendEmailCodeForServiceProvider", null);
tslib_1.__decorate([
    (0, rest_1.post)('/codeVerification/sendSmsCode', {
        responses: {
            '200': {
                description: 'User',
                content: {
                    'application/json': {
                        schema: String,
                    },
                },
            },
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.VerificationRequestObject, {
                    title: 'VerificationRequestObject',
                    partial: true,
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.VerificationRequestObject]),
    tslib_1.__metadata("design:returntype", Promise)
], CodeVerificationController.prototype, "sendSmsCode", null);
CodeVerificationController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.VerificationCodesRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.VerificationCodesRepository,
        repositories_1.AppUsersRepository,
        repositories_1.ServiceProviderRepository])
], CodeVerificationController);
exports.CodeVerificationController = CodeVerificationController;
//# sourceMappingURL=code-verification.controller.js.map