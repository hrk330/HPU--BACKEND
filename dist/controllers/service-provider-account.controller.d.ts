import { Count, Filter, Where } from '@loopback/repository';
import { ServiceProvider, Account } from '../models';
import { ServiceProviderRepository } from '../repositories';
export declare class ServiceProviderAccountController {
    protected serviceProviderRepository: ServiceProviderRepository;
    constructor(serviceProviderRepository: ServiceProviderRepository);
    get(id: string, filter?: Filter<Account>): Promise<Account>;
    create(id: typeof ServiceProvider.prototype.id, account: Omit<Account, 'accountId'>): Promise<Account>;
    patch(id: string, account: Partial<Account>, where?: Where<Account>): Promise<Count>;
    delete(id: string, where?: Where<Account>): Promise<Count>;
}
