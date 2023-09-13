import { Filter, FilterExcludingWhere } from '@loopback/repository';
import { WithdrawalRequest } from '../models';
import { AccountRepository, ServiceProviderRepository, WithdrawalRequestRepository } from '../repositories';
export declare class WithdrawalRequestsController {
    withdrawalRequestRepository: WithdrawalRequestRepository;
    serviceProviderRepository: ServiceProviderRepository;
    accountRepository: AccountRepository;
    constructor(withdrawalRequestRepository: WithdrawalRequestRepository, serviceProviderRepository: ServiceProviderRepository, accountRepository: AccountRepository);
    create(withdrawalRequest: Omit<WithdrawalRequest, 'withdrawalRequestId'>): Promise<string>;
    createAdminWithdrawalRequest(withdrawalRequest: Omit<WithdrawalRequest, 'withdrawalRequestId'>): Promise<string>;
    serviceProviderGetAllRequests(serviceProviderId: string, filter?: Filter<WithdrawalRequest>): Promise<string>;
    adminGetAllRequests(filter?: Filter<WithdrawalRequest>): Promise<string>;
    findById(id: string, filter?: FilterExcludingWhere<WithdrawalRequest>): Promise<string>;
    updateWithdrawalRequest(id: string, withdrawalRequest: WithdrawalRequest): Promise<string>;
    deleteById(id: string): Promise<void>;
}
