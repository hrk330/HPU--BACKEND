import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Company, CompanyRelations, UserCreds, Account, BankAccount, ServiceProvider } from '../models';
import { UserCredsRepository } from './user-creds.repository';
import { AccountRepository } from './account.repository';
import { BankAccountRepository } from './bank-account.repository';
import { ServiceProviderRepository } from './service-provider.repository';
export declare class CompanyRepository extends DefaultCrudRepository<Company, typeof Company.prototype.id, CompanyRelations> {
    protected userCredsRepositoryGetter: Getter<UserCredsRepository>;
    protected accountRepositoryGetter: Getter<AccountRepository>;
    protected bankAccountRepositoryGetter: Getter<BankAccountRepository>;
    protected serviceProviderRepositoryGetter: Getter<ServiceProviderRepository>;
    readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof Company.prototype.id>;
    readonly account: HasOneRepositoryFactory<Account, typeof Company.prototype.id>;
    readonly bankAccount: HasOneRepositoryFactory<BankAccount, typeof Company.prototype.id>;
    readonly serviceProviders: HasManyRepositoryFactory<ServiceProvider, typeof Company.prototype.id>;
    constructor(dataSource: MongoDbDataSource, userCredsRepositoryGetter: Getter<UserCredsRepository>, accountRepositoryGetter: Getter<AccountRepository>, bankAccountRepositoryGetter: Getter<BankAccountRepository>, serviceProviderRepositoryGetter: Getter<ServiceProviderRepository>);
}
