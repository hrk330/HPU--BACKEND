import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { WithdrawalRequest, WithdrawalRequestRelations } from '../models';
export declare class WithdrawalRequestRepository extends DefaultCrudRepository<WithdrawalRequest, typeof WithdrawalRequest.prototype.withdrawalRequestId, WithdrawalRequestRelations> {
    constructor(dataSource: MongoDbDataSource);
}
