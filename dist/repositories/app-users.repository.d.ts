import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { AppUsers, AppUsersRelations, UserCreds, Vehicle, UserDocs, Account, WithdrawalRequest } from '../models';
import { UserCredsRepository } from './user-creds.repository';
import { VehicleRepository } from './vehicle.repository';
import { UserDocsRepository } from './user-docs.repository';
import { AccountRepository } from './account.repository';
import { WithdrawalRequestRepository } from './withdrawal-request.repository';
export declare class AppUsersRepository extends DefaultCrudRepository<AppUsers, typeof AppUsers.prototype.id, AppUsersRelations> {
    protected vehicleRepositoryGetter: Getter<VehicleRepository>;
    protected userCredsRepositoryGetter: Getter<UserCredsRepository>;
    protected userDocsRepositoryGetter: Getter<UserDocsRepository>;
    protected accountRepositoryGetter: Getter<AccountRepository>;
    protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>;
    readonly vehicles: HasManyRepositoryFactory<Vehicle, typeof AppUsers.prototype.id>;
    readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof AppUsers.prototype.id>;
    readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof AppUsers.prototype.id>;
    readonly account: HasOneRepositoryFactory<Account, typeof AppUsers.prototype.id>;
    readonly withdrawalRequests: HasManyRepositoryFactory<WithdrawalRequest, typeof AppUsers.prototype.id>;
    constructor(dataSource: MongoDbDataSource, vehicleRepositoryGetter: Getter<VehicleRepository>, userCredsRepositoryGetter: Getter<UserCredsRepository>, userDocsRepositoryGetter: Getter<UserDocsRepository>, accountRepositoryGetter: Getter<AccountRepository>, withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>);
}
