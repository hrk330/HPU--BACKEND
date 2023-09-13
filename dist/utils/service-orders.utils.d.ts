import { Company, ServiceOrders, ServiceProvider, Transaction, TransactionResponse } from '../models';
import { CompanyRepository, ServiceProviderRepository, TransactionRepository } from '../repositories';
export declare class ServiceOrdersUtils {
    populateTransactionObject: (transactionResponse: TransactionResponse, serviceOrderId: string) => Transaction;
    getServiceProvider(serviceProviderId: string, serviceProviderRepository: ServiceProviderRepository): Promise<ServiceProvider>;
    processTransactionResponse(transactionResponse: TransactionResponse, serviceOrderId: string, transactionRepository: TransactionRepository): Promise<void>;
    getCompany(companyId: string, companyRepository: CompanyRepository): Promise<Company>;
    populateCompanyDetailsInOrder(companyId: string, serviceOrder: Omit<ServiceOrders, 'serviceOrderId'>, companyRepository: CompanyRepository): Promise<void>;
    populateServiceProviderAndCompanyDetailsInOrder(serviceOrder: Omit<ServiceOrders, 'serviceOrderId'>, serviceProviderRepository: ServiceProviderRepository, companyRepository: CompanyRepository): Promise<void>;
    populateAdminCreatedOrderStatus(serviceType: string, serviceOrder: Omit<ServiceOrders, 'serviceOrderId'>): void;
    populateStatusDates(serviceOrders: ServiceOrders): Promise<void>;
}
