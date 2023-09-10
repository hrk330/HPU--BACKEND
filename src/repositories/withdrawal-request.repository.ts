import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {WithdrawalRequest, WithdrawalRequestRelations} from '../models';

export class WithdrawalRequestRepository extends DefaultCrudRepository<
  WithdrawalRequest,
  typeof WithdrawalRequest.prototype.withdrawalRequestId,
  WithdrawalRequestRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(WithdrawalRequest, dataSource);
  }
}
