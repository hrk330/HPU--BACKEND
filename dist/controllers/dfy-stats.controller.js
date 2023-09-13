"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DfyStatsController = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
let DfyStatsController = class DfyStatsController {
    constructor(serviceOrdersRepository, appUsersRepository, servicesRepository, paymentRepository, promoCodesRepository, serviceProviderRepository, transactionRepository) {
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.appUsersRepository = appUsersRepository;
        this.servicesRepository = servicesRepository;
        this.paymentRepository = paymentRepository;
        this.promoCodesRepository = promoCodesRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.transactionRepository = transactionRepository;
    }
    async initiatePayment() {
        const revenueStats = new models_1.RevenueStats();
        const result = {
            code: 5,
            msg: 'Some error occurred while initiating payment.',
            dfyStats: {},
        };
        try {
            const dbOrders = await this.serviceOrdersRepository.find({ where: { serviceType: "Done For You" } });
            const paymentOrderIds = dbOrders.map(dbOrder => dbOrder.serviceOrderId);
            const dfyPayments = await this.paymentRepository.find({ where: { paymentStatus: 'C', paymentOrderId: { inq: paymentOrderIds } } });
            revenueStats.revenue = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.paymentAmount, 0);
            revenueStats.earning = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.platformFee, 0);
            revenueStats.coffer = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.paymentAmount, 0);
            revenueStats.outstandingCash = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.platformFee, 0);
            result.dfyStats = revenueStats;
            result.code = 0;
            result.msg = 'Stats fetched successfully.';
        }
        catch (e) {
            console.log(e);
        }
        return JSON.stringify(result);
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/dfy/getDashboardStats'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], DfyStatsController.prototype, "initiatePayment", null);
DfyStatsController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.PaymentRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.PromoCodesRepository)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__param(6, (0, repository_1.repository)(repositories_1.TransactionRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceOrdersRepository,
        repositories_1.AppUsersRepository,
        repositories_1.ServicesRepository,
        repositories_1.PaymentRepository,
        repositories_1.PromoCodesRepository,
        repositories_1.ServiceProviderRepository,
        repositories_1.TransactionRepository])
], DfyStatsController);
exports.DfyStatsController = DfyStatsController;
//# sourceMappingURL=dfy-stats.controller.js.map