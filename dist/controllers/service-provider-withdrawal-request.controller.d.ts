import { Count, Filter, Where } from '@loopback/repository';
import { ServiceProvider, WithdrawalRequest } from '../models';
import { ServiceProviderRepository } from '../repositories';
export declare class ServiceProviderWithdrawalRequestController {
    protected serviceProviderRepository: ServiceProviderRepository;
    constructor(serviceProviderRepository: ServiceProviderRepository);
    find(id: string, filter?: Filter<WithdrawalRequest>): Promise<WithdrawalRequest[]>;
    create(id: typeof ServiceProvider.prototype.id, withdrawalRequest: Omit<WithdrawalRequest, 'withdrawalRequestId'>): Promise<WithdrawalRequest>;
    patch(id: string, withdrawalRequest: Partial<WithdrawalRequest>, where?: Where<WithdrawalRequest>): Promise<Count>;
    delete(id: string, where?: Where<WithdrawalRequest>): Promise<Count>;
}
