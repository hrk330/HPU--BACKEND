import { AppUsersRepository, PaymentRepository, PromoCodesRepository, ServiceOrdersRepository, ServiceProviderRepository, ServicesRepository, TransactionRepository } from '../repositories';
export declare class DfyStatsController {
    serviceOrdersRepository: ServiceOrdersRepository;
    appUsersRepository: AppUsersRepository;
    servicesRepository: ServicesRepository;
    paymentRepository: PaymentRepository;
    promoCodesRepository: PromoCodesRepository;
    serviceProviderRepository: ServiceProviderRepository;
    transactionRepository: TransactionRepository;
    constructor(serviceOrdersRepository: ServiceOrdersRepository, appUsersRepository: AppUsersRepository, servicesRepository: ServicesRepository, paymentRepository: PaymentRepository, promoCodesRepository: PromoCodesRepository, serviceProviderRepository: ServiceProviderRepository, transactionRepository: TransactionRepository);
    initiatePayment(): Promise<string>;
}
