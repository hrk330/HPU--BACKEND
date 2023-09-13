"use strict";
// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUploadController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const promises_1 = require("node:fs/promises");
const keys_1 = require("../keys");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
let FileUploadController = class FileUploadController {
    /**
     * Constructor
     * @param handler - Inject an express request handler to deal with the request
     */
    constructor(handler, appUsersRepository, companyRepository, serviceProviderRepository, userDocsRepository) {
        this.handler = handler;
        this.appUsersRepository = appUsersRepository;
        this.companyRepository = companyRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.userDocsRepository = userDocsRepository;
    }
    async fileUpload(request, response, userId) {
        if (userId) {
            return new Promise((resolve, reject) => {
                this.handler(request, response, err => {
                    if (err) {
                        err.code = 5;
                        resolve(err);
                    }
                    else {
                        resolve(this.saveUploadedFileRecords(request));
                    }
                });
            });
        }
        else {
            return {
                code: 5,
                msg: 'Some error occurred while uploading doc.',
                userDoc: {},
            };
        }
    }
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    async saveUploadedFileRecords(request) {
        const uploadedFiles = request.files;
        const files = [];
        if (Array.isArray(uploadedFiles)) {
            for (const entry of uploadedFiles) {
                const result = await this.insertFilesData(request, entry);
                files.push(lodash_1.default.pick(result.userDoc, [
                    'id',
                    'docType',
                    'docName',
                    'docSize',
                    'userId',
                    'creadtedAt',
                ]));
            }
        }
        return { code: 0, msg: 'File uploaded successfully', files };
    }
    async insertFilesData(request, file) {
        var _a;
        const result = {
            code: 5,
            msg: 'Some error occurred while updating doc.',
            userDoc: {},
        };
        try {
            if (file === null || file === void 0 ? void 0 : file.destination) {
                file.destination = '/assets/media/';
            }
            let userDoc = new models_1.UserDocs();
            let userDocsArray = [];
            if ((_a = request === null || request === void 0 ? void 0 : request.body) === null || _a === void 0 ? void 0 : _a.id) {
                userDocsArray = await this.userDocsRepository
                    .find({ where: { id: request.body.id } });
            }
            if ((userDocsArray === null || userDocsArray === void 0 ? void 0 : userDocsArray.length) > 0) {
                try {
                    await (0, promises_1.unlink)(__dirname +
                        '/../../public/assets/media/' +
                        userDocsArray[0].docName);
                }
                catch (e) {
                    console.log(e.message);
                }
                userDoc.docName = file.filename;
                userDoc.docSize = file.size;
                userDoc.mimetype = file.mimetype;
                userDoc.docPath = '/assets/media/';
                userDoc.docStatus = 'P';
                userDoc.comments = request.body.comments;
                userDoc.updatedAt = new Date();
                await this.userDocsRepository.update(userDoc, { id: request.body.id });
                userDoc = new models_1.UserDocs();
                userDocsArray = await this.userDocsRepository.find({ where: { id: request.body.id } });
                if ((userDocsArray === null || userDocsArray === void 0 ? void 0 : userDocsArray.length) > 0) {
                    userDoc = userDocsArray[0];
                }
            }
            else {
                userDoc = await this.userDocsRepository
                    .create({
                    userId: request.body.userId,
                    docType: request.body.docType,
                    docName: file.filename,
                    docSize: file.size,
                    mimetype: file.mimetype,
                    docStatus: 'P',
                    docPath: '/assets/media/',
                    comments: request.body.comments,
                });
            }
            if (request.body.docType === 'AUPP') {
                //update appuser profile pic
                await this.appUsersRepository.updateById(request.body.userId, {
                    profilePic: '/assets/media/' + file.filename,
                });
            }
            else if (request.body.docType === 'SPPP') {
                //update service provider profile pic
                await this.serviceProviderRepository.updateById(request.body.userId, {
                    profilePic: '/assets/media/' + file.filename,
                });
            }
            else if (request.body.docType === 'COPP') {
                //update company profile pic
                await this.companyRepository.updateById(request.body.userId, {
                    profilePic: '/assets/media/' + file.filename,
                });
            }
            result.userDoc = userDoc;
            result.code = 0;
            result.msg = 'File uploaded successfully';
        }
        catch (e) {
            result.code = 5;
            result.msg = e.message;
        }
        return result;
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/files/{userId}', {
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                        },
                    },
                },
                description: 'Files and fields',
            },
        },
    }),
    tslib_1.__param(0, rest_1.requestBody.file()),
    tslib_1.__param(1, (0, core_1.inject)(rest_1.RestBindings.Http.RESPONSE)),
    tslib_1.__param(2, rest_1.param.path.string('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], FileUploadController.prototype, "fileUpload", null);
FileUploadController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(keys_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.UserDocsRepository)),
    tslib_1.__metadata("design:paramtypes", [Function, repositories_1.AppUsersRepository,
        repositories_1.CompanyRepository,
        repositories_1.ServiceProviderRepository,
        repositories_1.UserDocsRepository])
], FileUploadController);
exports.FileUploadController = FileUploadController;
//# sourceMappingURL=file-upload.controller.js.map