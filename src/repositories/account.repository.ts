import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Account, AccountRelations, WithdrawalRequest} from '../models';
import {WithdrawalRequestRepository} from './withdrawal-request.repository';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.accountId,
  AccountRelations
> {
  public readonly withdrawalRequests: HasManyRepositoryFactory<
    WithdrawalRequest,
    typeof Account.prototype.accountId
  >;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
    @repository.getter('WithdrawalRequestRepository')
    protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>,
  ) {
    super(Account, dataSource);
    this.withdrawalRequests = this.createHasManyRepositoryFactoryFor(
      'withdrawalRequests',
      withdrawalRequestRepositoryGetter,
    );
    this.registerInclusionResolver(
      'withdrawalRequests',
      this.withdrawalRequests.inclusionResolver,
    );
  }
}
