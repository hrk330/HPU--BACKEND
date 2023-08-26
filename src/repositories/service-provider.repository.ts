import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  HasOneRepositoryFactory,
  HasManyRepositoryFactory,
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {
  ServiceProvider,
  ServiceProviderRelations,
  UserCreds,
  UserDocs,
  WithdrawalRequest,
  Account,
} from '../models';
import {UserCredsRepository} from './user-creds.repository';
import {UserDocsRepository} from './user-docs.repository';
import {WithdrawalRequestRepository} from './withdrawal-request.repository';
import {AccountRepository} from './account.repository';

export class ServiceProviderRepository extends DefaultCrudRepository<
  ServiceProvider,
  typeof ServiceProvider.prototype.id,
  ServiceProviderRelations
> {
  public readonly userCreds: HasOneRepositoryFactory<
    UserCreds,
    typeof ServiceProvider.prototype.id
  >;

  public readonly userDocs: HasManyRepositoryFactory<
    UserDocs,
    typeof ServiceProvider.prototype.id
  >;

  public readonly withdrawalRequests: HasManyRepositoryFactory<
    WithdrawalRequest,
    typeof ServiceProvider.prototype.id
  >;

  public readonly account: HasOneRepositoryFactory<
    Account,
    typeof ServiceProvider.prototype.id
  >;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
    @repository.getter('UserCredsRepository')
    protected userCredsRepositoryGetter: Getter<UserCredsRepository>,
    @repository.getter('UserDocsRepository')
    protected userDocsRepositoryGetter: Getter<UserDocsRepository>,
    @repository.getter('WithdrawalRequestRepository')
    protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>,
    @repository.getter('AccountRepository')
    protected accountRepositoryGetter: Getter<AccountRepository>,
  ) {
    super(ServiceProvider, dataSource);
    this.account = this.createHasOneRepositoryFactoryFor(
      'account',
      accountRepositoryGetter,
    );
    this.registerInclusionResolver('account', this.account.inclusionResolver);
    this.withdrawalRequests = this.createHasManyRepositoryFactoryFor(
      'withdrawalRequests',
      withdrawalRequestRepositoryGetter,
    );
    this.registerInclusionResolver(
      'withdrawalRequests',
      this.withdrawalRequests.inclusionResolver,
    );
    this.userDocs = this.createHasManyRepositoryFactoryFor(
      'userDocs',
      userDocsRepositoryGetter,
    );
    this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
    this.userCreds = this.createHasOneRepositoryFactoryFor(
      'userCreds',
      userCredsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'userCreds',
      this.userCreds.inclusionResolver,
    );
  }
}
