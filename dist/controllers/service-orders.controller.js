"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const services_1 = require("../services");
// import {OrderEmailsUtil} from '../utils/order-emails.utils';
const service_orders_utils_1 = require("../utils/service-orders.utils");
//import _ from 'lodash';
let ServiceOrdersController = class ServiceOrdersController {
    // private orderEmailsUtil: OrderEmailsUtil = new OrderEmailsUtil();
    constructor(serviceOrdersRepository, appUsersRepository, servicesRepository, paymentRepository, promoCodesRepository, serviceProviderRepository, transactionRepository, companyRepository) {
        this.serviceOrdersRepository = serviceOrdersRepository;
        this.appUsersRepository = appUsersRepository;
        this.servicesRepository = servicesRepository;
        this.paymentRepository = paymentRepository;
        this.promoCodesRepository = promoCodesRepository;
        this.serviceProviderRepository = serviceProviderRepository;
        this.transactionRepository = transactionRepository;
        this.companyRepository = companyRepository;
        this.serviceOrdersUtils = new service_orders_utils_1.ServiceOrdersUtils();
    }
    async adminCreateOrder(serviceOrders) {
        var _a;
        const result = {
            code: 5,
            msg: 'Some error occurred while creating order.',
            order: {},
        };
        try {
            const service = await this.servicesRepository.findById(serviceOrders.serviceId);
            const appUser = await this.appUsersRepository.findById(serviceOrders.userId, {
                fields: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'endpoint',
                    'profilePic',
                    'phoneNo',
                ],
            });
            if (service && appUser) {
                this.serviceOrdersUtils.populateAdminCreatedOrderStatus(service.serviceType, serviceOrders);
                await this.serviceOrdersUtils.populateServiceProviderAndCompanyDetailsInOrder(serviceOrders, this.serviceProviderRepository, this.companyRepository);
                serviceOrders.userName = appUser.firstName + ' ' + appUser.lastName;
                serviceOrders.userEmail = appUser.email;
                serviceOrders.appUserProfilePic = appUser.profilePic;
                serviceOrders.appUserPhoneNumber = appUser.phoneNo;
                serviceOrders.taxPercentage = service.salesTax;
                serviceOrders.serviceName = service.serviceName;
                serviceOrders.serviceType = service.serviceType;
                serviceOrders.serviceFee = 0;
                if (service.serviceFee) {
                    serviceOrders.serviceFee = service.serviceFee;
                }
                if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.distance) {
                    serviceOrders.distanceAmount =
                        service.pricePerKm * serviceOrders.distance;
                    serviceOrders.grossAmount =
                        service.price + serviceOrders.distanceAmount;
                }
                else {
                    serviceOrders.grossAmount = service.price;
                }
                if (!serviceOrders.serviceFeePaid) {
                    serviceOrders.grossAmount += serviceOrders.serviceFee;
                }
                if (serviceOrders.taxPercentage) {
                    serviceOrders.taxAmount =
                        serviceOrders.grossAmount * (serviceOrders.taxPercentage / 100);
                }
                else {
                    serviceOrders.taxAmount = 0;
                }
                serviceOrders.netAmount =
                    serviceOrders.grossAmount + serviceOrders.taxAmount;
                if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.promoCode) {
                    const promoCodeObj = await this.promoCodesRepository.findOne({
                        where: { promoCode: serviceOrders.promoCode },
                    });
                    if (promoCodeObj === null || promoCodeObj === void 0 ? void 0 : promoCodeObj.promoId) {
                        const userOrdersWithPromoCode = await this.serviceOrdersRepository.find({
                            where: {
                                userId: serviceOrders.userId,
                                promoCode: serviceOrders.promoCode,
                            },
                            fields: ['serviceOrderId'],
                        });
                        if (promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
                            userOrdersWithPromoCode &&
                            userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
                            let promoDiscount = 0;
                            if (promoCodeObj.discountType === 'R') {
                                if (promoCodeObj.discountValue < service.price) {
                                    promoDiscount = promoCodeObj.discountValue;
                                }
                                else {
                                    promoDiscount = serviceOrders.grossAmount;
                                }
                            }
                            else if (promoCodeObj.discountType === 'P') {
                                promoDiscount =
                                    serviceOrders.grossAmount *
                                        (promoCodeObj.discountValue / 100);
                            }
                            serviceOrders.discountAmount = promoDiscount;
                            serviceOrders.promoCode = promoCodeObj.promoCode;
                            serviceOrders.promoId = promoCodeObj.promoId;
                            serviceOrders.discountType = promoCodeObj.discountType;
                            serviceOrders.discountValue = promoCodeObj.discountValue;
                            if (!serviceOrders.serviceFeePaid) {
                                serviceOrders.grossAmount += serviceOrders.serviceFee;
                            }
                            if (serviceOrders.taxPercentage) {
                                serviceOrders.taxAmount =
                                    (serviceOrders.grossAmount - promoDiscount) *
                                        (serviceOrders.taxPercentage / 100);
                            }
                            else {
                                serviceOrders.taxAmount = 0;
                            }
                            serviceOrders.netAmount =
                                serviceOrders.grossAmount -
                                    promoDiscount +
                                    serviceOrders.taxAmount;
                            promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
                            promoCodeObj.updatedAt = new Date();
                            await this.promoCodesRepository.updateById(promoCodeObj === null || promoCodeObj === void 0 ? void 0 : promoCodeObj.promoId, promoCodeObj);
                        }
                    }
                }
                const createdOrder = await this.serviceOrdersRepository.create(serviceOrders);
                await this.sendServiceProviderOrderUpdateNotification(createdOrder, true);
                if (((_a = appUser === null || appUser === void 0 ? void 0 : appUser.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                    await this.sendOrderNotification(appUser.endpoint, 'Order Alert', 'New order has been created.', createdOrder);
                }
                result.code = 0;
                result.msg = 'Order created successfully';
                result.order = createdOrder;
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async create(serviceOrders) {
        var _a;
        let createdOrder = new models_1.ServiceOrders();
        try {
            serviceOrders.status = 'LO';
            const appUser = await this.appUsersRepository.findById(serviceOrders.userId, {
                fields: [
                    'id',
                    'email',
                    'firstName',
                    'lastName',
                    'endpoint',
                    'profilePic',
                    'phoneNo',
                ],
            });
            const service = await this.servicesRepository.findById(serviceOrders.serviceId);
            if (service && appUser) {
                serviceOrders.userName = appUser.firstName + ' ' + appUser.lastName;
                serviceOrders.userEmail = appUser.email;
                serviceOrders.appUserProfilePic = appUser.profilePic;
                serviceOrders.appUserPhoneNumber = appUser.phoneNo;
                serviceOrders.taxPercentage = service.salesTax;
                serviceOrders.serviceName = service.serviceName;
                serviceOrders.serviceType = service.serviceType;
                serviceOrders.serviceFee = 0;
                if (service.serviceFee) {
                    serviceOrders.serviceFee = service.serviceFee;
                }
                if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.distance) {
                    serviceOrders.distanceAmount =
                        service.pricePerKm * serviceOrders.distance;
                    serviceOrders.grossAmount =
                        service.price + serviceOrders.distanceAmount;
                }
                else {
                    serviceOrders.grossAmount = service.price;
                }
                if (!serviceOrders.serviceFeePaid) {
                    serviceOrders.grossAmount += serviceOrders.serviceFee;
                }
                if (serviceOrders.taxPercentage) {
                    serviceOrders.taxAmount =
                        serviceOrders.grossAmount * (serviceOrders.taxPercentage / 100);
                }
                else {
                    serviceOrders.taxAmount = 0;
                }
                serviceOrders.netAmount =
                    serviceOrders.grossAmount + serviceOrders.taxAmount;
                createdOrder = await this.serviceOrdersRepository.create(serviceOrders);
                if (service.serviceType !== 'Done For You') {
                    const serviceProviders = await this.serviceProviderRepository.find({
                        where: { roleId: 'SERVICEPROVIDER', userStatus: 'A' },
                        fields: ['endpoint'],
                    });
                    if (Array.isArray(serviceProviders) && serviceProviders.length > 0) {
                        for (const serviceProvider of serviceProviders) {
                            if (((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                                await this.sendOrderNotification(serviceProvider.endpoint, 'Order Alert', 'A new order is available.', createdOrder);
                            }
                        }
                    }
                }
            }
            (0, services_1.sendCustomMail)(serviceOrders.userEmail, 'Order Confirmation', serviceOrders.userName, createdOrder.serviceOrderId, serviceOrders.serviceName, 'orderCreate', undefined, createdOrder.netAmount);
        }
        catch (e) {
            console.log(e);
        }
        return createdOrder;
    }
    async sendOrderNotification(endpoint, title, body, order) {
        await (0, services_1.sendMessage)({
            notification: { title: title, body: body },
            data: {
                orderId: order.serviceOrderId + '',
                serviceName: order.serviceName + '',
                creationTime: order.createdAt + '',
                serviceType: order.serviceType + '',
                orderStatus: order.status + '',
                price: order.netAmount + '',
                vehicleType: order.vehicleType + '',
                accidental: order.accidental + '',
            },
            token: endpoint,
        });
    }
    async updateOrder(serviceOrders) {
        let result = {
            code: 5,
            msg: 'Some error occurred while updating order.',
            order: {},
        };
        let dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
        if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
            ['UC', 'SC', 'AC'].indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) < 0 &&
            (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) &&
            ['LO', 'CC', 'OA', 'RA', 'AR', 'ST'].indexOf(serviceOrders.status) >= 0) {
            try {
                await this.serviceOrdersUtils.populateStatusDates(serviceOrders);
                if (serviceOrders.serviceProviderId && (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'OA') {
                    const serviceProvider = await this.serviceOrdersUtils.getServiceProvider(serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceProviderId, this.serviceProviderRepository);
                    const company = await this.serviceOrdersUtils.getCompany(serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.companyId, this.companyRepository);
                    if (company) {
                        serviceOrders.companyEmail = company.email;
                        serviceOrders.companyId = company.id;
                        serviceOrders.companyName = company.companyName;
                        serviceOrders.companyProfilePic = company.profilePic;
                        serviceOrders.companyPhoneNumber = company.phoneNo;
                    }
                    console.log('Service Provider ', serviceProvider);
                    if (serviceProvider) {
                        serviceOrders.serviceProviderName =
                            serviceProvider.firstName + ' ' + serviceProvider.lastName;
                        serviceOrders.serviceProviderEmail = serviceProvider.email;
                        serviceOrders.serviceProviderPhoneNumber = serviceProvider.phoneNo;
                        serviceOrders.serviceProviderProfilePic =
                            serviceProvider.profilePic;
                    }
                    console.log('User Email 4', dbOrder.userEmail);
                    console.log('Rider Name From DBORDER = ', dbOrder.serviceProviderName);
                    console.log('Rider name from service orders = ', serviceOrders.serviceProviderName);
                    if (dbOrder.userEmail) {
                        (0, services_1.sendCustomMail)(dbOrder.userEmail, `Order Accepted by ${serviceOrders.serviceProviderName}`, dbOrder.userName, dbOrder.serviceOrderId, dbOrder.serviceName, 'orderCreate', undefined, dbOrder.netAmount);
                    }
                    if (serviceOrders.companyEmail && serviceOrders.serviceProviderId) {
                        (0, services_1.sendCustomMail)(serviceOrders.companyEmail, `Order Containing this ID (${dbOrder.serviceOrderId}) Accepted by ${serviceOrders.serviceProviderName}`, serviceOrders.companyName, dbOrder.serviceOrderId, dbOrder.serviceName, 'orderCreate', undefined, dbOrder.netAmount);
                    }
                }
                await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
                dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
                await this.sendAppUserOrderUpdateNotification(dbOrder);
                await this.sendServiceProviderOrderUpdateNotification(dbOrder, false);
                result = { code: 0, msg: 'Order updated successfully.', order: dbOrder };
            }
            catch (e) {
                console.log(e);
                result.code = 5;
                result.msg = e.message;
            }
        }
        return JSON.stringify(result);
    }
    async completeOrder(orderRequest) {
        var _a, _b;
        let result = {
            code: 5,
            msg: 'Some error occurred while completing order.',
            order: {},
            user: {},
        };
        let dbOrder = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
        if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
            'UC,SC,AC'.indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) < 0 &&
            ((_a = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _a === void 0 ? void 0 : _a.status) === 'CO' &&
            ((_b = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _b === void 0 ? void 0 : _b.serviceOrderId)) {
            try {
                await this.serviceOrdersUtils.populateStatusDates(orderRequest.serviceOrder);
                await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
                dbOrder = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
                const appUser = await this.appUsersRepository.find({
                    where: { roleId: 'APPUSER', id: dbOrder.userId },
                });
                await this.sendAppUserOrderUpdateNotification(dbOrder);
                result = {
                    code: 0,
                    msg: 'Order completed successfully.',
                    order: dbOrder,
                    user: appUser,
                };
            }
            catch (e) {
                console.log(e);
                result.code = 5;
                result.msg = e.message;
            }
        }
        return JSON.stringify(result);
    }
    async adminCompleteOrder(orderRequest) {
        var _a, _b;
        let result = {
            code: 5,
            msg: 'Some error occurred while completing order.',
            order: {},
        };
        try {
            let dbOrder = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
                ['UC', 'SC', 'AC'].indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) === -1 &&
                ((_a = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _a === void 0 ? void 0 : _a.status) === 'CO' &&
                ((_b = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _b === void 0 ? void 0 : _b.serviceOrderId)) {
                await this.serviceOrdersUtils.populateStatusDates(orderRequest.serviceOrder);
                await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
                dbOrder = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
                await this.sendAppUserOrderUpdateNotification(dbOrder);
                await this.sendServiceProviderOrderUpdateNotification(dbOrder, true);
                result = {
                    code: 0,
                    msg: 'Order completed successfully.',
                    order: dbOrder,
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
    async initiatePayment(orderRequest) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        let result = {
            code: 5,
            msg: 'Some error occurred while initiating payment.',
            order: {},
        };
        try {
            if (((_a = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _a === void 0 ? void 0 : _a.serviceOrderId) &&
                (((_b = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _b === void 0 ? void 0 : _b.paymentMethod) === 'CASH' ||
                    ((_c = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _c === void 0 ? void 0 : _c.paymentMethod) === 'CARD')) {
                const dbOrder = await this.serviceOrdersRepository.findById((_d = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _d === void 0 ? void 0 : _d.serviceOrderId);
                if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) === 'CO' &&
                    ((_e = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _e === void 0 ? void 0 : _e.status) === 'PI') {
                    orderRequest.payment.payerId = dbOrder.userId;
                    orderRequest.payment.receiverId = dbOrder.serviceProviderId;
                    orderRequest.payment.paymentOrderId = dbOrder.serviceOrderId;
                    orderRequest.payment.paymentStatus = 'L';
                    await this.paymentRepository.create(orderRequest.payment);
                    await this.serviceOrdersUtils.populateStatusDates(orderRequest.serviceOrder);
                    const serviceProviderAccount = await this.serviceProviderRepository
                        .account(dbOrder.serviceProviderId)
                        .get({});
                    let balanceAmount = 0;
                    if (((_f = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _f === void 0 ? void 0 : _f.paymentMethod) === 'CARD') {
                        balanceAmount =
                            serviceProviderAccount.balanceAmount + dbOrder.netAmount * 0.9;
                    }
                    else if (((_g = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _g === void 0 ? void 0 : _g.paymentMethod) === 'CASH') {
                        balanceAmount =
                            serviceProviderAccount.balanceAmount - dbOrder.netAmount * 0.1;
                    }
                    await this.serviceProviderRepository
                        .account(dbOrder.serviceProviderId)
                        .patch({ balanceAmount: balanceAmount }, {});
                    await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
                    if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.promoId) && dbOrder.orderType === 'U') {
                        const promoCodeObj = await this.promoCodesRepository.findById(dbOrder.promoId, {});
                        if (promoCodeObj) {
                            promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
                            promoCodeObj.updatedAt = new Date();
                            await this.promoCodesRepository.updateById(dbOrder.promoId, promoCodeObj);
                        }
                    }
                    const updatedDbOrder = await this.serviceOrdersRepository.findById((_h = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _h === void 0 ? void 0 : _h.serviceOrderId);
                    await this.sendServiceProviderOrderUpdateNotification(updatedDbOrder, false);
                    result = {
                        code: 0,
                        msg: 'Payment initiated successfully.',
                        order: updatedDbOrder,
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
    async processCardPaymentFailure(transactionResponse, serviceOrderId) {
        const result = { code: 5, msg: 'Payment failed.', order: {} };
        if (serviceOrderId) {
            const dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);
            await this.serviceOrdersUtils.processTransactionResponse(transactionResponse, dbOrder.serviceOrderId, this.transactionRepository);
            result.order = dbOrder;
        }
        return JSON.stringify(result);
    }
    async processCardPaymentSuccess(transactionResponse, serviceOrderId) {
        var _a, _b;
        let result = {
            code: 5,
            msg: 'Some error occurred while completing payment.',
            order: {},
        };
        if (serviceOrderId) {
            let dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);
            await this.serviceOrdersUtils.processTransactionResponse(transactionResponse, dbOrder.serviceOrderId, this.transactionRepository);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) === 'CO' &&
                (transactionResponse === null || transactionResponse === void 0 ? void 0 : transactionResponse.status) === 'APPROVED') {
                try {
                    const paymentObj = new models_1.Payment();
                    paymentObj.payerId = dbOrder.userId;
                    paymentObj.paymentOrderId = dbOrder.serviceOrderId;
                    paymentObj.receiverId = dbOrder.serviceProviderId;
                    paymentObj.paymentType = 'CARD';
                    paymentObj.paymentAmount = dbOrder.netAmount;
                    paymentObj.paymentStatus = 'C';
                    await this.paymentRepository.create(paymentObj);
                    dbOrder.paymentType = paymentObj.paymentType;
                    dbOrder.status = 'PC';
                    await this.serviceOrdersUtils.populateStatusDates(dbOrder);
                    await this.serviceOrdersRepository.updateById(serviceOrderId, dbOrder);
                    dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);
                    const serviceProviderAccount = await this.serviceProviderRepository
                        .account(dbOrder.serviceProviderId)
                        .get({});
                    const balanceAmount = serviceProviderAccount.balanceAmount + dbOrder.netAmount * 0.9;
                    await this.serviceProviderRepository
                        .account(dbOrder.serviceProviderId)
                        .patch({ balanceAmount: balanceAmount }, {});
                    if (dbOrder.promoId && dbOrder.orderType === 'U') {
                        const promoCodeObj = await this.promoCodesRepository.findById(dbOrder.promoId, {});
                        if (promoCodeObj) {
                            promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
                            promoCodeObj.updatedAt = new Date();
                            await this.promoCodesRepository.updateById(dbOrder.promoId, promoCodeObj);
                        }
                    }
                    dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);
                    const serviceProvider = await this.serviceProviderRepository.findById(dbOrder.serviceProviderId, { fields: ['endpoint'] });
                    if (((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                        await this.sendOrderNotification(serviceProvider.endpoint, 'Order Alert', 'Payment has been completed.', dbOrder);
                    }
                    const appUser = await this.appUsersRepository.findById(dbOrder.userId, { fields: ['endpoint'] });
                    if (((_b = appUser === null || appUser === void 0 ? void 0 : appUser.endpoint) === null || _b === void 0 ? void 0 : _b.length) > 20) {
                        await this.sendOrderNotification(appUser.endpoint, 'Order Alert', 'Payment has been completed.', dbOrder);
                    }
                    result = {
                        code: 0,
                        msg: 'Payment completed successfully.',
                        order: dbOrder,
                    };
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async completePayment(orderRequest) {
        var _a, _b, _c, _d;
        let result = {
            code: 5,
            msg: 'Some error occurred while completing payment.',
            order: {},
        };
        if ((_a = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _a === void 0 ? void 0 : _a.serviceOrderId) {
            const dbOrder = await this.serviceOrdersRepository.findById((_b = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _b === void 0 ? void 0 : _b.serviceOrderId);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) === 'PI' &&
                ((_c = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _c === void 0 ? void 0 : _c.status) === 'PC') {
                try {
                    await this.serviceOrdersUtils.populateStatusDates(orderRequest.serviceOrder);
                    const paymentObj = await this.paymentRepository.findOne({
                        where: { paymentOrderId: orderRequest.serviceOrder.serviceOrderId },
                    });
                    if (paymentObj) {
                        paymentObj.paymentStatus = 'C';
                        await this.paymentRepository.updateById(paymentObj.paymentId, paymentObj);
                        await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
                        const updatedDbOrder = await this.serviceOrdersRepository.findById((_d = orderRequest === null || orderRequest === void 0 ? void 0 : orderRequest.serviceOrder) === null || _d === void 0 ? void 0 : _d.serviceOrderId);
                        await this.sendAppUserOrderUpdateNotification(updatedDbOrder);
                        result = {
                            code: 0,
                            msg: 'Payment completed successfully.',
                            order: updatedDbOrder,
                        };
                    }
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async sendAppUserOrderUpdateNotification(serviceOrders) {
        var _a;
        let title = '', body = '';
        if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.userId) {
            const appUser = await this.appUsersRepository.findById(serviceOrders.userId, { fields: ['endpoint'] });
            if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) && ((_a = appUser === null || appUser === void 0 ? void 0 : appUser.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'OA') {
                    title = 'Order Accepted';
                    body = 'Your Order has been accepted.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'AR') {
                    title = 'Service Provider Arrived';
                    body = 'Service Provider has arrived at your location.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'RA') {
                    title = 'Rider is arriving';
                    body = 'Service Provider is arriving at your location.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'CC') {
                    title = 'Time has been confirmed.';
                    body = 'Rider has confirmed the time.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'ST') {
                    title = 'Order Started';
                    body = 'Your order has started.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'CO') {
                    title = 'Order Completed';
                    body = 'Your order has been completed.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'PC') {
                    title = 'Payment Completed';
                    body = 'Your payment has been completed.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'SC') {
                    title = 'Order Canceled';
                    body = 'Order has been canceled by the service provider.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'AC') {
                    title = 'Order Canceled By Admin';
                    body = 'Order has been canceled by the admin.';
                }
                await this.sendOrderNotification(appUser.endpoint, title, body, serviceOrders);
            }
        }
    }
    async sendServiceProviderOrderUpdateNotification(serviceOrders, isCreatedByAdmin) {
        var _a;
        let title = '', body = '';
        if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceProviderId) {
            const serviceProvider = await this.serviceProviderRepository.findById(serviceOrders.serviceProviderId, { fields: ['endpoint'] });
            if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) && ((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'LO' || (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'OA') {
                    if (isCreatedByAdmin) {
                        title = 'Order Alert';
                        body = 'New order has been assigned.';
                    }
                    // await this.orderEmailsUtil.sendAcceptOrderEmail(serviceOrders);
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'CO') {
                    title = 'Order Completed';
                    body = 'Order has been completed.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'PC') {
                    title = 'Payment Completed';
                    body = 'Your payment has been completed.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'PI') {
                    title = 'Payment Initiated';
                    body = 'Payment has been initiated.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'UC') {
                    title = 'Order Canceled';
                    body = 'Order has been canceled by the user.';
                }
                else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'AC') {
                    title = 'Order Canceled By Admin';
                    body = 'Order has been canceled by the admin.';
                }
                await this.sendOrderNotification(serviceProvider.endpoint, title, body, serviceOrders);
            }
        }
    }
    async rateOrder(serviceOrder) {
        let result = {
            code: 5,
            msg: 'Some error occurred while rating order.',
            order: {},
        };
        if ((serviceOrder === null || serviceOrder === void 0 ? void 0 : serviceOrder.rating) && (serviceOrder === null || serviceOrder === void 0 ? void 0 : serviceOrder.serviceOrderId)) {
            try {
                serviceOrder.updatedAt = new Date();
                await this.serviceOrdersRepository.updateById(serviceOrder.serviceOrderId, serviceOrder);
                const dbOrder = await this.serviceOrdersRepository.findById(serviceOrder.serviceOrderId);
                const serviceProviderOrders = await this.serviceOrdersRepository.find({
                    where: {
                        serviceProviderId: dbOrder.serviceProviderId,
                        rating: { gt: 0 },
                    },
                });
                let serviceProviderRating = 0;
                if ((serviceProviderOrders === null || serviceProviderOrders === void 0 ? void 0 : serviceProviderOrders.length) > 0) {
                    let totalRating = 0;
                    serviceProviderOrders.forEach(order => {
                        if (order === null || order === void 0 ? void 0 : order.rating) {
                            totalRating += order.rating;
                        }
                    });
                    serviceProviderRating = totalRating / serviceProviderOrders.length;
                }
                await this.serviceProviderRepository.updateById(dbOrder.serviceProviderId, { rating: serviceProviderRating });
                //await this.sendOrderUpdateNotification(dbOrder);
                result = { code: 0, msg: 'Order rated successfully.', order: dbOrder };
            }
            catch (e) {
                console.log(e);
                result.code = 5;
                result.msg = e.message;
            }
        }
        return JSON.stringify(result);
    }
    async serviceProviderCancelOrder(serviceOrders) {
        let result = {
            code: 5,
            msg: 'Some error occurred while canceling order.',
            order: {},
        };
        if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceOrderId) {
            let dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
                'OA,CC,AR,ST'.indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) >= 0 &&
                (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) &&
                'SC'.indexOf(serviceOrders.status) >= 0 &&
                dbOrder.serviceProviderId + '' === serviceOrders.serviceProviderId + '') {
                try {
                    await this.serviceOrdersUtils.populateStatusDates(serviceOrders);
                    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
                    dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
                    if (dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.userId) {
                        await this.sendAppUserOrderUpdateNotification(dbOrder);
                    }
                    result = { code: 0, msg: 'Order canceled.', order: dbOrder };
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async appUserCancelOrder(serviceOrders) {
        let result = {
            code: 5,
            msg: 'Some error occurred while canceling order.',
            order: {},
        };
        if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceOrderId) {
            let dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
                ['LO', 'CC', 'OA', 'RA', 'AR'].indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) >= 0 &&
                (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) &&
                'UC'.indexOf(serviceOrders.status) >= 0) {
                try {
                    await this.serviceOrdersUtils.populateStatusDates(serviceOrders);
                    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
                    dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
                    if (dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.serviceProviderId) {
                        await this.sendServiceProviderOrderUpdateNotification(dbOrder, false);
                    }
                    result = { code: 0, msg: 'Order canceled.', order: dbOrder };
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async adminUserCancelOrder(serviceOrders) {
        let result = {
            code: 5,
            msg: 'Some error occurred while canceling order.',
            order: {},
        };
        if (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceOrderId) {
            let dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
            if ((dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) &&
                ['LO', 'CC', 'OA', 'RA', 'AR'].indexOf(dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.status) >= 0 &&
                (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'AC') {
                try {
                    await this.serviceOrdersUtils.populateStatusDates(serviceOrders);
                    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
                    dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
                    if (dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.serviceProviderId) {
                        await this.sendServiceProviderOrderUpdateNotification(dbOrder, true);
                    }
                    if (dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.userId) {
                        await this.sendAppUserOrderUpdateNotification(dbOrder);
                    }
                    result = { code: 0, msg: 'Order canceled.', order: dbOrder };
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async appUserApplyPromoCode(serviceOrders) {
        var _a;
        let result = {
            code: 5,
            msg: 'Some error occurred while applying promo code.',
            order: {},
        };
        let dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
        const promoCodeObj = await this.promoCodesRepository.findOne({
            where: { promoCode: serviceOrders.promoCode },
        });
        if (promoCodeObj && dbOrder) {
            try {
                const userOrdersWithPromoCode = await this.serviceOrdersRepository.find({
                    where: { userId: dbOrder.userId, promoCode: serviceOrders.promoCode },
                    fields: ['serviceOrderId'],
                });
                if (promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
                    userOrdersWithPromoCode &&
                    userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
                    let promoDiscount = 0;
                    if (promoCodeObj.discountType === 'R') {
                        if (promoCodeObj.discountValue < dbOrder.grossAmount) {
                            promoDiscount = promoCodeObj.discountValue;
                        }
                        else {
                            promoDiscount = dbOrder.grossAmount;
                        }
                    }
                    else if (promoCodeObj.discountType === 'P') {
                        promoDiscount =
                            dbOrder.grossAmount * (promoCodeObj.discountValue / 100);
                    }
                    dbOrder.discountAmount = promoDiscount;
                    dbOrder.promoCode = promoCodeObj.promoCode;
                    dbOrder.promoId = promoCodeObj.promoId;
                    dbOrder.discountType = promoCodeObj.discountType;
                    dbOrder.discountValue = promoCodeObj.discountValue;
                    if (!serviceOrders.serviceFeePaid) {
                        serviceOrders.grossAmount += serviceOrders.serviceFee;
                    }
                    if (dbOrder.taxPercentage) {
                        dbOrder.taxAmount =
                            (dbOrder.grossAmount - promoDiscount) *
                                (dbOrder.taxPercentage / 100);
                    }
                    else {
                        dbOrder.taxAmount = 0;
                    }
                    dbOrder.netAmount =
                        dbOrder.grossAmount - promoDiscount + dbOrder.taxAmount;
                    dbOrder.updatedAt = new Date();
                    await this.serviceOrdersRepository.updateById(dbOrder.serviceOrderId, dbOrder);
                    dbOrder = await this.serviceOrdersRepository.findById(dbOrder.serviceOrderId);
                    if (dbOrder === null || dbOrder === void 0 ? void 0 : dbOrder.serviceProviderId) {
                        const serviceProvider = await this.serviceProviderRepository.findById(dbOrder.serviceProviderId, { fields: ['endpoint'] });
                        if (((_a = serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.endpoint) === null || _a === void 0 ? void 0 : _a.length) > 20) {
                            await this.sendOrderNotification(serviceProvider.endpoint, 'Order Alert', 'A promo code has been applied by the user.', dbOrder);
                        }
                    }
                    result = {
                        code: 0,
                        msg: 'Promo code applied successfully.',
                        order: dbOrder,
                    };
                }
                else if (promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
                    result.msg = 'Coupon has reached its limit.';
                }
                else if (userOrdersWithPromoCode &&
                    userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
                    result.msg = 'User has reached this coupons limit.';
                }
            }
            catch (e) {
                console.log(e);
                result.code = 5;
                result.msg = e.message;
            }
        }
        return JSON.stringify(result);
    }
    async adminUserApplyPromoCode(serviceOrders) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting promo info.',
            order: {},
        };
        if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.serviceId) &&
            (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.promoCode) &&
            (serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.userId)) {
            const promoCodeObj = await this.promoCodesRepository.findOne({
                where: { promoCode: serviceOrders.promoCode },
            });
            const service = await this.servicesRepository.findById(serviceOrders.serviceId);
            if (promoCodeObj && service) {
                try {
                    const userOrdersWithPromoCode = await this.serviceOrdersRepository.find({
                        where: {
                            userId: serviceOrders.userId,
                            promoCode: serviceOrders.promoCode,
                        },
                        fields: ['serviceOrderId'],
                    });
                    if (promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
                        userOrdersWithPromoCode &&
                        userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
                        let promoDiscount = 0;
                        if (promoCodeObj.discountType === 'R') {
                            if (promoCodeObj.discountValue < service.price) {
                                promoDiscount = promoCodeObj.discountValue;
                            }
                            else {
                                promoDiscount = service.price;
                            }
                        }
                        else if (promoCodeObj.discountType === 'P') {
                            promoDiscount =
                                service.price * (promoCodeObj.discountValue / 100);
                        }
                        serviceOrders.discountAmount = promoDiscount;
                        serviceOrders.promoCode = promoCodeObj.promoCode;
                        serviceOrders.promoId = promoCodeObj.promoId;
                        serviceOrders.discountType = promoCodeObj.discountType;
                        serviceOrders.discountValue = promoCodeObj.discountValue;
                        serviceOrders.netAmount = service.price - promoDiscount;
                        result = {
                            code: 0,
                            msg: 'Promo code applied successfully.',
                            order: serviceOrders,
                        };
                    }
                    else if (promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
                        result.msg = 'Coupon has reached its limit.';
                    }
                    else if (userOrdersWithPromoCode &&
                        userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
                        result.msg = 'User has reached this coupons limit.';
                    }
                }
                catch (e) {
                    console.log(e);
                    result.code = 5;
                    result.msg = e.message;
                }
            }
        }
        return JSON.stringify(result);
    }
    async find(serviceProviderId, filter) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting orders.',
            orders: {},
        };
        try {
            if (filter) {
                filter.where = { ...filter.where, serviceProviderId: serviceProviderId };
            }
            else {
                filter = { where: { serviceProviderId: serviceProviderId } };
            }
            if (serviceProviderId && serviceProviderId.length > 0) {
                const orders = await this.serviceOrdersRepository.find(filter);
                result = { code: 0, msg: 'Orders fetched successfully.', orders: orders };
            }
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async getAllOrdersForAdmin(filter) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting orders.',
            orders: {},
        };
        try {
            const orders = await this.serviceOrdersRepository.find(filter);
            if ((orders === null || orders === void 0 ? void 0 : orders.length) > 0) {
                for (const order of orders) {
                    try {
                        if (order.serviceProviderId) {
                            order.serviceProvider =
                                await this.serviceProviderRepository.findById(order.serviceProviderId);
                        }
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            result = { code: 0, msg: 'Orders fetched successfully.', orders: orders };
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async getOrderDetailsForAdmin(serviceOrderId) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting order.',
            order: {},
        };
        try {
            const order = await this.serviceOrdersRepository.findById(serviceOrderId);
            result = { code: 0, msg: 'Order fetched successfully.', order: order };
        }
        catch (e) {
            console.log(e);
            result.code = 5;
            result.msg = e.message;
        }
        return JSON.stringify(result);
    }
    async count(where) {
        return this.serviceOrdersRepository.count(where);
    }
    async sendNotification(token) {
        await (0, services_1.sendMessage)({
            notification: {
                title: 'Test Notification ',
                body: 'This is a sample test msg.',
            },
            data: {},
            token: token,
        });
        return 'SUCCESS';
    }
    async findByServiceProviderId(serviceOrderId, serviceProviderId) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting orders.',
            orders: {},
        };
        try {
            if ((serviceProviderId === null || serviceProviderId === void 0 ? void 0 : serviceProviderId.length) > 0 && (serviceOrderId === null || serviceOrderId === void 0 ? void 0 : serviceOrderId.length) > 0) {
                const dbServiceOrders = await this.serviceOrdersRepository.find({
                    where: {
                        serviceOrderId: serviceOrderId,
                        serviceProviderId: serviceProviderId,
                    },
                });
                if (dbServiceOrders && dbServiceOrders.length > 0) {
                    result = {
                        code: 0,
                        msg: 'Orders fetched successfully.',
                        orders: dbServiceOrders,
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
    async findByAppUserId(serviceOrderId, appUserId, filter) {
        var _a;
        let result = {
            code: 5,
            msg: 'Some error occurred while getting order details.',
            orders: {},
            serviceProvider: {},
        };
        try {
            if ((appUserId === null || appUserId === void 0 ? void 0 : appUserId.length) > 0 && (serviceOrderId === null || serviceOrderId === void 0 ? void 0 : serviceOrderId.length) > 0) {
                if (filter) {
                    filter.where = {
                        ...filter.where,
                        serviceOrderId: serviceOrderId,
                        userId: appUserId,
                    };
                }
                else {
                    filter = {
                        where: {
                            serviceOrderId: serviceOrderId,
                            userId: appUserId,
                        },
                    };
                }
                const dbServiceOrders = await this.serviceOrdersRepository.find(filter);
                if ((dbServiceOrders === null || dbServiceOrders === void 0 ? void 0 : dbServiceOrders.length) > 0) {
                    let serviceProvider = {};
                    if ((_a = dbServiceOrders[0]) === null || _a === void 0 ? void 0 : _a.serviceProviderId) {
                        serviceProvider = await this.serviceProviderRepository.findById(dbServiceOrders[0].serviceProviderId);
                    }
                    result = {
                        code: 0,
                        msg: 'Orders fetched successfully.',
                        orders: dbServiceOrders[0],
                        serviceProvider: serviceProvider,
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
    async findUserServiceOrders(appUserId, filter) {
        let result = {
            code: 5,
            msg: 'Some error occurred while getting orders.',
            orders: {},
        };
        try {
            if ((appUserId === null || appUserId === void 0 ? void 0 : appUserId.length) > 0) {
                if (filter) {
                    filter.where = { ...filter.where, userId: appUserId };
                }
                else {
                    filter = { where: { userId: appUserId } };
                }
                const dbServiceOrders = await this.serviceOrdersRepository.find(filter);
                if (dbServiceOrders && dbServiceOrders.length > 0) {
                    result = {
                        code: 0,
                        msg: 'Orders fetched successfully.',
                        orders: dbServiceOrders,
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
    async getCurrentOrder(userType, userId, orderType) {
        const result = { code: 0, msg: 'Order fetched successfully.', order: {} };
        let dbServiceOrders = [];
        const requiredServiceIdArray = [];
        if ((orderType === null || orderType === void 0 ? void 0 : orderType.toUpperCase()) === 'DFY') {
            requiredServiceIdArray.push('Done For You');
        }
        else {
            requiredServiceIdArray.push('General Assistance');
            requiredServiceIdArray.push('Car Tow');
        }
        const serviceArray = await this.servicesRepository.find({
            where: { serviceType: { inq: requiredServiceIdArray } },
            fields: ['serviceId'],
        });
        const serviceIdArray = serviceArray.map(service => service.serviceId);
        if (userType === 'U') {
            dbServiceOrders = await this.serviceOrdersRepository.find({
                where: {
                    userId: userId,
                    serviceId: { inq: serviceIdArray },
                    status: { inq: ['LO', 'CC', 'OA', 'RA', 'AR', 'ST', 'CO', 'PI'] },
                },
            });
        }
        else if (userType === 'S') {
            dbServiceOrders = await this.serviceOrdersRepository.find({
                where: {
                    serviceProviderId: userId,
                    serviceId: { inq: serviceIdArray },
                    status: { inq: ['OA', 'CC', 'RA', 'AR', 'ST', 'CO', 'PI'] },
                },
            });
        }
        result.order = dbServiceOrders;
        return JSON.stringify(result);
    }
    async updateById(id, serviceOrders) {
        await this.serviceOrdersRepository.updateById(id, serviceOrders);
    }
    async replaceById(id, serviceOrders) {
        await this.serviceOrdersRepository.replaceById(id, serviceOrders);
    }
    async deleteById(id) {
        await this.serviceOrdersRepository.deleteById(id);
    }
};
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/adminUser/createOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, {
                    title: 'NewServiceOrders',
                    exclude: ['serviceOrderId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "adminCreateOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/createOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, {
                    title: 'NewServiceOrders',
                    exclude: ['serviceOrderId'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "create", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/serviceProvider/updateOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "updateOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/serviceProvider/completeOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.OrderRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "completeOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/adminUser/completeOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.OrderRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "adminCompleteOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/initiatePayment'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.OrderRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "initiatePayment", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/processCardPayment/failure/{serviceOrderId}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.TransactionResponse, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.path.string('serviceOrderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.TransactionResponse, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "processCardPaymentFailure", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/processCardPayment/success/{serviceOrderId}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.TransactionResponse, { partial: true }),
            },
        },
    })),
    tslib_1.__param(1, rest_1.param.path.string('serviceOrderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.TransactionResponse, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "processCardPaymentSuccess", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/serviceProvider/completePayment'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.OrderRequest, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.OrderRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "completePayment", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/serviceProvider/rateOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "rateOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/serviceProvider/cancelOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "serviceProviderCancelOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/cancelOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "appUserCancelOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/adminUser/cancelOrder'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "adminUserCancelOrder", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/appUser/applyPromoCode'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "appUserApplyPromoCode", null);
tslib_1.__decorate([
    (0, rest_1.post)('/serviceOrders/adminUser/applyPromoCode'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: { 'application/json': { schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders) } },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "adminUserApplyPromoCode", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('jwt'),
    (0, rest_1.get)('/serviceOrders/serviceProvider/getAllOrders/{serviceProviderId}'),
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
    tslib_1.__param(0, rest_1.param.path.string('serviceProviderId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "find", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/adminUser/getAllOrders'),
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
    tslib_1.__param(0, rest_1.param.filter(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "getAllOrdersForAdmin", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/adminUser/getOrderDetails/{serviceOrderId}'),
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
    tslib_1.__param(0, rest_1.param.path.string('serviceOrderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "getOrderDetailsForAdmin", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/count'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "count", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/sendNotification/{token}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model count',
        content: { 'application/json': { schema: repository_1.CountSchema } },
    }),
    tslib_1.__param(0, rest_1.param.path.string('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "sendNotification", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/serviceProvider/getServiceOrderDetails/{serviceOrderId}/{serviceProviderId}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('serviceOrderId')),
    tslib_1.__param(1, rest_1.param.path.string('serviceProviderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "findByServiceProviderId", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/appUser/getServiceOrderDetails/{serviceOrderId}/{appUserId}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('serviceOrderId')),
    tslib_1.__param(1, rest_1.param.path.string('appUserId')),
    tslib_1.__param(2, rest_1.param.filter(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "findByAppUserId", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/appUser/getUserServiceOrders/{appUserId}'),
    (0, rest_1.response)(200, {
        description: 'ServiceOrders model instance',
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { includeRelations: true }),
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('appUserId')),
    tslib_1.__param(1, rest_1.param.filter(models_1.ServiceOrders)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "findUserServiceOrders", null);
tslib_1.__decorate([
    (0, rest_1.get)('/serviceOrders/getCurrentOrder/{userType}/{userId}/{orderType}'),
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
    tslib_1.__param(0, rest_1.param.path.string('userType')),
    tslib_1.__param(1, rest_1.param.path.string('userId')),
    tslib_1.__param(2, rest_1.param.path.string('orderType')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "getCurrentOrder", null);
tslib_1.__decorate([
    (0, rest_1.patch)('/serviceOrders/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceOrders PATCH success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.ServiceOrders, { partial: true }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, rest_1.put)('/serviceOrders/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceOrders PUT success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, models_1.ServiceOrders]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "replaceById", null);
tslib_1.__decorate([
    (0, rest_1.del)('/serviceOrders/{id}'),
    (0, rest_1.response)(204, {
        description: 'ServiceOrders DELETE success',
    }),
    tslib_1.__param(0, rest_1.param.path.string('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ServiceOrdersController.prototype, "deleteById", null);
ServiceOrdersController = tslib_1.__decorate([
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.ServiceOrdersRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.AppUsersRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.ServicesRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.PaymentRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.PromoCodesRepository)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.ServiceProviderRepository)),
    tslib_1.__param(6, (0, repository_1.repository)(repositories_1.TransactionRepository)),
    tslib_1.__param(7, (0, repository_1.repository)(repositories_1.CompanyRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.ServiceOrdersRepository,
        repositories_1.AppUsersRepository,
        repositories_1.ServicesRepository,
        repositories_1.PaymentRepository,
        repositories_1.PromoCodesRepository,
        repositories_1.ServiceProviderRepository,
        repositories_1.TransactionRepository,
        repositories_1.CompanyRepository])
], ServiceOrdersController);
exports.ServiceOrdersController = ServiceOrdersController;
//# sourceMappingURL=service-orders.controller.js.map