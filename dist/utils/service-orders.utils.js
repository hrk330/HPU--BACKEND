"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceOrdersUtils = void 0;
const models_1 = require("../models");
const repositories_1 = require("../repositories");
class ServiceOrdersUtils {
    constructor() {
        this.populateTransactionObject = (transactionResponse, serviceOrderId) => {
            const transaction = new models_1.Transaction();
            transaction.serviceOrderId = serviceOrderId;
            transaction.transactionProcessedDateTime =
                transactionResponse.txndate_processed;
            transaction.cardBin = transactionResponse.ccbin;
            transaction.timezone = transactionResponse.timezone;
            transaction.processorNetworkInformation =
                transactionResponse.processor_network_information;
            transaction.oid = transactionResponse.oid;
            transaction.country = transactionResponse.cccountry;
            transaction.expiryMonth = transactionResponse.expmonth;
            transaction.hashAlgorithm = transactionResponse.hash_algorithm;
            transaction.endpointTransactionId =
                transactionResponse.endpointTransactionId;
            transaction.currency = transactionResponse.currency;
            transaction.processorResponseCode =
                transactionResponse.processor_response_code;
            transaction.chargeTotal = transactionResponse.chargetotal;
            transaction.terminalId = transactionResponse.terminal_id;
            transaction.associationResponseCode =
                transactionResponse.associationResponseCode;
            transaction.approvalCode = transactionResponse.approval_code;
            transaction.expiryYear = transactionResponse.expyear;
            transaction.responseHash = transactionResponse.response_hash;
            transaction.transactionDateInSeconds = transactionResponse.tdate;
            transaction.installmentsInterest =
                transactionResponse.installments_interest;
            transaction.bankName = transactionResponse.bname;
            transaction.CardBrand = transactionResponse.ccbrand;
            transaction.referenceNumber = transactionResponse.refnumber;
            transaction.transactionType = transactionResponse.txntype;
            transaction.paymentMethod = transactionResponse.paymentMethod;
            transaction.transactionDateTime = transactionResponse.txndatetime;
            transaction.cardNumber = transactionResponse.cardnumber;
            transaction.ipgTransactionId = transactionResponse.ipgTransactionId;
            transaction.status = transactionResponse.status;
            return transaction;
        };
    }
    async getServiceProvider(serviceProviderId, serviceProviderRepository) {
        let serviceProvider = new models_1.ServiceProvider();
        if (serviceProviderId) {
            serviceProvider = await serviceProviderRepository.findById(serviceProviderId, { fields: ['id', 'email', 'firstName', 'lastName', 'endpoint', 'companyId', 'profilePic', 'phoneNo'] });
        }
        return serviceProvider;
    }
    async processTransactionResponse(transactionResponse, serviceOrderId, transactionRepository) {
        const transaction = this.populateTransactionObject(transactionResponse, serviceOrderId);
        await transactionRepository.create(transaction);
    }
    async getCompany(companyId, companyRepository) {
        let company = new models_1.Company();
        try {
            if (companyId) {
                company = await companyRepository.findById(companyId, {
                    fields: ['id', 'email', 'companyName', 'profilePic', 'phoneNo'],
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        return company;
    }
    async populateCompanyDetailsInOrder(companyId, serviceOrder, companyRepository) {
        if (companyId && serviceOrder && companyRepository) {
            const company = await this.getCompany(companyId, companyRepository);
            if (company === null || company === void 0 ? void 0 : company.id) {
                serviceOrder.companyEmail = company.email;
                serviceOrder.companyId = company.id;
                serviceOrder.companyName = company.companyName;
                serviceOrder.companyProfilePic = company.profilePic;
                serviceOrder.companyPhoneNumber = company.phoneNo;
            }
        }
    }
    async populateServiceProviderAndCompanyDetailsInOrder(serviceOrder, serviceProviderRepository, companyRepository) {
        if (serviceOrder && repositories_1.ServiceProviderRepository) {
            const serviceProvider = await this.getServiceProvider(serviceOrder.serviceProviderId, serviceProviderRepository);
            if (serviceProvider === null || serviceProvider === void 0 ? void 0 : serviceProvider.id) {
                serviceOrder.serviceProviderName =
                    serviceProvider.firstName + ' ' + serviceProvider.lastName;
                serviceOrder.serviceProviderEmail = serviceProvider.email;
                serviceOrder.serviceProviderPhoneNumber = serviceProvider.phoneNo;
                serviceOrder.serviceProviderProfilePic = serviceProvider.profilePic;
                if (serviceProvider.companyId && companyRepository) {
                    await this.populateCompanyDetailsInOrder(serviceProvider.companyId, serviceOrder, companyRepository);
                }
            }
        }
    }
    populateAdminCreatedOrderStatus(serviceType, serviceOrder) {
        if ((serviceOrder === null || serviceOrder === void 0 ? void 0 : serviceOrder.serviceProviderId) &&
            !(serviceType === 'Done For You')) {
            serviceOrder.status = 'OA';
        }
        else {
            serviceOrder.status = 'LO';
        }
    }
    async populateStatusDates(serviceOrders) {
        const currentDateTime = new Date();
        if (serviceOrders) {
            if (serviceOrders.status === 'OA') {
                serviceOrders.acceptedAt = currentDateTime;
            }
            else if (serviceOrders.status === 'AR') {
                serviceOrders.arrivedAt = currentDateTime;
            }
            else if (serviceOrders.status === 'CC') {
                serviceOrders.confirmedAt = currentDateTime;
            }
            else if (serviceOrders.status === 'ST') {
                serviceOrders.startedAt = currentDateTime;
            }
            else if (serviceOrders.status === 'PC') {
                serviceOrders.payedAt = currentDateTime;
            }
            else if ((serviceOrders === null || serviceOrders === void 0 ? void 0 : serviceOrders.status) === 'CO') {
                serviceOrders.completedAt = currentDateTime;
            }
        }
        serviceOrders.updatedAt = currentDateTime;
    }
}
exports.ServiceOrdersUtils = ServiceOrdersUtils;
//# sourceMappingURL=service-orders.utils.js.map