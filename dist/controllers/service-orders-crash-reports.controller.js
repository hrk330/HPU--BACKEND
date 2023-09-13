"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersCrashReportsController = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
let ServiceOrdersCrashReportsController = class ServiceOrdersCrashReportsController {
    constructor(serviceOrdersRepository, crashReportsRepository, userDocsRepository) {
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.crashReportsRepository = crashReportsRepository;
        this.userDocsRepository = userDocsRepository;
    }
    async get(id, filter) {
        const result = {
            code: 5,
            msg: 'Some error occurred while getting crash report.',
            crashReport: {},
        };
        try {
            const crashReport = await this.crashReportsRepository.findOne({ where: { serviceOrderId: id } });
            if (crashReport) {
                const witnessList = await this.crashReportsRepository
                    .witnesses(crashReport.crashReportId)
                    .find();
                if (crashReport.crashReportDocIds) {
                    crashReport.crashReportDocs = await this.userDocsRepository.find({
                        where: { id: { inq: crashReport.crashReportDocIds } },
                    });
                }
                if (crashReport.otherPartyDocIds) {
                    crashReport.otherPartyDocs = await this.userDocsRepository.find({
                        where: { id: { inq: crashReport.otherPartyDocIds } },
                    });
                }
                crashReport.witnessList = witnessList;
                result.crashReport = crashReport;
                result.code = 0;
                result.msg = 'Crash report fetched successfully.';
            }
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async create(id, crashReports) {
        const result = {
            code: 5,
            msg: 'Some error occurred while creating crash report.',
            crashReport: {},
        };
        try {
            const crashReport = await this.crashReportsRepository.findOne({ where: { serviceOrderId: id } });
            if (crashReport) {
                result.code = 5;
                result.msg = 'Crash report already exists.';
            }
            else {
                const witnessList = crashReports.witnessList;
                crashReports.witnessList = [];
                const dbCrashReport = await this.serviceOrdersRepository
                    .crashReport(id)
                    .create(crashReports);
                if (dbCrashReport) {
                    if ((witnessList === null || witnessList === void 0 ? void 0 : witnessList.length) > 0) {
                        for (const witness of witnessList) {
                            dbCrashReport.witnessList.push(await this.crashReportsRepository
                                .witnesses(dbCrashReport.crashReportId)
                                .create(witness));
                        }
                    }
                    if (dbCrashReport.crashReportDocIds) {
                        dbCrashReport.crashReportDocs = await this.userDocsRepository.find({
                            where: { id: { inq: dbCrashReport.crashReportDocIds } },
                        });
                    }
                    if (dbCrashReport.otherPartyDocIds) {
                        dbCrashReport.otherPartyDocs = await this.userDocsRepository.find({
                            where: { id: { inq: dbCrashReport.otherPartyDocIds } },
                        });
                    }
                    result.crashReport = dbCrashReport;
                    result.code = 0;
                    result.msg = 'Crash report created successfully.';
                }
            }
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
    async patch(id, crashReports, where) {
        const result = {
            code: 5,
            msg: 'Some error occurred while updating crash report.',
            crashReport: {},
        };
        try {
            await this.serviceOrdersRepository
                .crashReport(id)
                .patch(crashReports, where);
            const crashReport = await this.serviceOrdersRepository
                .crashReport(id)
                .get();
            if (crashReport) {
                const witnessList = await this.crashReportsRepository
                    .witnesses(crashReport.crashReportId)
                    .find();
                if (crashReport.crashReportDocIds) {
                    crashReport.crashReportDocs = await this.userDocsRepository.find({
                        where: { id: { inq: crashReport.crashReportDocIds } },
                    });
                }
                if (crashReport.otherPartyDocIds) {
                    crashReport.otherPartyDocs = await this.userDocsRepository.find({
                        where: { id: { inq: crashReport.otherPartyDocIds } },
                    });
                }
                crashReport.witnessList = witnessList;
                result.crashReport = crashReport;
                result.code = 0;
                result.msg = 'Crash report updated successfully.';
            }
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/{id}/getcrashReport', {
        responses: {
            '200': {
                description: 'ServiceOrders has one CrashReports',
                content: {
                    'application/json': {
                        schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports),
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
], ServiceOrdersCrashReportsController.prototype, "get", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/{id}/createCrashReport', {
        responses: {
            '200': {
                description: 'ServiceOrders model instance',
                content: {
                    'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports) },
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, {
                    title: 'NewCrashReportsInServiceOrders',
                    exclude: ['crashReportId'],
                    optional: ['serviceOrderId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersCrashReportsController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/{id}/updateCrashReport', {
        responses: {
            '200': {
                description: 'ServiceOrders.CrashReports PATCH success count',
                content: { 'application/json': { schema: repository_1.CountSchema } },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.CrashReports, { partial: true }),
            },
        },
    })),
    tslib_1.__param(2, rest_1.param.where(models_1.CrashReports)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersCrashReportsController.prototype, "patch", null);
ServiceOrdersCrashReportsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.CrashReportsRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.UserDocsRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceOrdersRepository,
        repositories_1.CrashReportsRepository,
        repositories_1.UserDocsRepository])
], ServiceOrdersCrashReportsController);
exports.ServiceOrdersCrashReportsController = ServiceOrdersCrashReportsController;
//# sourceMappingURL=service-orders-crash-reports.controller.js.map