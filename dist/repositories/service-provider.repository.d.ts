import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { ServiceProvider, ServiceProviderRelations, UserCreds, UserDocs, WithdrawalRequest, Account } from '../models';
import { UserCredsRepository } from './user-creds.repository';
import { UserDocsRepository } from './user-docs.repository';
import { WithdrawalRequestRepository } from './withdrawal-request.repository';
import { AccountRepository } from './account.repository';
export declare class ServiceProviderRepository extends DefaultCrudRepository<ServiceProvider, typeof ServiceProvider.prototype.id, ServiceProviderRelations> {
    protected userCredsRepositoryGetter: Getter<UserCredsRepository>;
    protected userDocsRepositoryGetter: Getter<UserDocsRepository>;
    protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>;
    protected accountRepositoryGetter: Getter<AccountRepository>;
    readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof ServiceProvider.prototype.id>;
    readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof ServiceProvider.prototype.id>;
    readonly withdrawalRequests: HasManyRepositoryFactory<WithdrawalRequest, typeof ServiceProvider.prototype.id>;
    readonly account: HasOneRepositoryFactory<Account, typeof ServiceProvider.prototype.id>;
    constructor(dataSource: MongoDbDataSource, userCredsRepositoryGetter: Getter<UserCredsRepository>, userDocsRepositoryGetter: Getter<UserDocsRepository>, withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>, accountRepositoryGetter: Getter<AccountRepository>);
}
