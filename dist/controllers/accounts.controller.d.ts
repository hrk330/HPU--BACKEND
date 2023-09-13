import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Account } from '../models';
import { AccountRepository, ServiceOrdersRepository, ServiceProviderRepository } from '../repositories';
export declare class AccountsController {
    accountRepository: AccountRepository;
    serviceOrdersRepository: ServiceOrdersRepository;
    serviceProviderRepository: ServiceProviderRepository;
    constructor(accountRepository: AccountRepository, serviceOrdersRepository: ServiceOrdersRepository, serviceProviderRepository: ServiceProviderRepository);
    create(account: Omit<Account, 'accountId'>): Promise<Account>;
    count(where?: Where<Account>): Promise<Count>;
    find(filter?: Filter<Account>): Promise<Account[]>;
    getAccountInfo(serviceProviderId: string): Promise<string>;
    findById(id: string, filter?: FilterExcludingWhere<Account>): Promise<Account>;
    updateById(id: string, account: Account): Promise<void>;
    replaceById(id: string, account: Account): Promise<void>;
    deleteById(id: string): Promise<void>;
}
