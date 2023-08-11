import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Company, CompanyRelations, UserCreds, Account, BankAccount, ServiceProvider} from '../models';
import {UserCredsRepository} from './user-creds.repository';
import {AccountRepository} from './account.repository';
import {BankAccountRepository} from './bank-account.repository';
import {ServiceProviderRepository} from './service-provider.repository';

export class CompanyRepository extends DefaultCrudRepository<
  Company,
  typeof Company.prototype.id,
  CompanyRelations
> {

  public readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof Company.prototype.id>;

  public readonly account: HasOneRepositoryFactory<Account, typeof Company.prototype.id>;

  public readonly bankAccount: HasOneRepositoryFactory<BankAccount, typeof Company.prototype.id>;

  public readonly serviceProviders: HasManyRepositoryFactory<ServiceProvider, typeof Company.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserCredsRepository') protected userCredsRepositoryGetter: Getter<UserCredsRepository>, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>, @repository.getter('BankAccountRepository') protected bankAccountRepositoryGetter: Getter<BankAccountRepository>, @repository.getter('ServiceProviderRepository') protected serviceProviderRepositoryGetter: Getter<ServiceProviderRepository>,
  ) {
    super(Company, dataSource);
    this.serviceProviders = this.createHasManyRepositoryFactoryFor('serviceProviders', serviceProviderRepositoryGetter,);
    this.registerInclusionResolver('serviceProviders', this.serviceProviders.inclusionResolver);
    this.bankAccount = this.createHasOneRepositoryFactoryFor('bankAccount', bankAccountRepositoryGetter);
    this.registerInclusionResolver('bankAccount', this.bankAccount.inclusionResolver);
    this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
    this.registerInclusionResolver('account', this.account.inclusionResolver);
    this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
    this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
  }
}
