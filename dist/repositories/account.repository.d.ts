import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Account, AccountRelations, WithdrawalRequest } from '../models';
import { WithdrawalRequestRepository } from './withdrawal-request.repository';
export declare class AccountRepository extends DefaultCrudRepository<Account, typeof Account.prototype.accountId, AccountRelations> {
    protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>;
    readonly withdrawalRequests: HasManyRepositoryFactory<WithdrawalRequest, typeof Account.prototype.accountId>;
    constructor(dataSource: MongoDbDataSource, withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>);
}
