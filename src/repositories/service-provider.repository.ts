import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ServiceProvider, ServiceProviderRelations, UserCreds, UserDocs, WithdrawalRequest} from '../models';
import {UserCredsRepository} from './user-creds.repository';
import {UserDocsRepository} from './user-docs.repository';
import {WithdrawalRequestRepository} from './withdrawal-request.repository';

export class ServiceProviderRepository extends DefaultCrudRepository<
  ServiceProvider,
  typeof ServiceProvider.prototype.serviceProviderId,
  ServiceProviderRelations
> {

  public readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof ServiceProvider.prototype.serviceProviderId>;

  public readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof ServiceProvider.prototype.serviceProviderId>;

  public readonly withdrawalRequests: HasManyRepositoryFactory<WithdrawalRequest, typeof ServiceProvider.prototype.serviceProviderId>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserCredsRepository') protected userCredsRepositoryGetter: Getter<UserCredsRepository>, @repository.getter('UserDocsRepository') protected userDocsRepositoryGetter: Getter<UserDocsRepository>, @repository.getter('WithdrawalRequestRepository') protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>,
  ) {
    super(ServiceProvider, dataSource);
    this.withdrawalRequests = this.createHasManyRepositoryFactoryFor('withdrawalRequests', withdrawalRequestRepositoryGetter,);
    this.registerInclusionResolver('withdrawalRequests', this.withdrawalRequests.inclusionResolver);
    this.userDocs = this.createHasManyRepositoryFactoryFor('userDocs', userDocsRepositoryGetter,);
    this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
    this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
    this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
  }
}
