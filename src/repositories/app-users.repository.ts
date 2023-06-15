import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AppUsers, AppUsersRelations, UserCreds, Vehicle, UserDocs, Account, WithdrawalRequest, Payment} from '../models';
import {UserCredsRepository} from './user-creds.repository';
import {VehicleRepository} from './vehicle.repository';
import {UserDocsRepository} from './user-docs.repository';
import {AccountRepository} from './account.repository';
import {WithdrawalRequestRepository} from './withdrawal-request.repository';
import {PaymentRepository} from './payment.repository';

export class AppUsersRepository extends DefaultCrudRepository<
  AppUsers,
  typeof AppUsers.prototype.id,
  AppUsersRelations
> {

  public readonly vehicles: HasManyRepositoryFactory<Vehicle, typeof AppUsers.prototype.id>;

  public readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof AppUsers.prototype.id>;

  public readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof AppUsers.prototype.id>;

  public readonly account: HasOneRepositoryFactory<Account, typeof AppUsers.prototype.id>;

  public readonly withdrawalRequests: HasManyRepositoryFactory<WithdrawalRequest, typeof AppUsers.prototype.id>;

  public readonly payments: HasManyRepositoryFactory<Payment, typeof AppUsers.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('VehicleRepository') protected vehicleRepositoryGetter: Getter<VehicleRepository>, @repository.getter('UserCredsRepository') protected userCredsRepositoryGetter: Getter<UserCredsRepository>, @repository.getter('UserDocsRepository') protected userDocsRepositoryGetter: Getter<UserDocsRepository>, @repository.getter('AccountRepository') protected accountRepositoryGetter: Getter<AccountRepository>, @repository.getter('WithdrawalRequestRepository') protected withdrawalRequestRepositoryGetter: Getter<WithdrawalRequestRepository>, @repository.getter('PaymentRepository') protected paymentRepositoryGetter: Getter<PaymentRepository>,
  ) {
    super(AppUsers, dataSource);
    this.payments = this.createHasManyRepositoryFactoryFor('payments', paymentRepositoryGetter,);
    this.registerInclusionResolver('payments', this.payments.inclusionResolver);
    this.withdrawalRequests = this.createHasManyRepositoryFactoryFor('withdrawalRequests', withdrawalRequestRepositoryGetter,);
    this.registerInclusionResolver('withdrawalRequests', this.withdrawalRequests.inclusionResolver);
    this.account = this.createHasOneRepositoryFactoryFor('account', accountRepositoryGetter);
    this.registerInclusionResolver('account', this.account.inclusionResolver);
    this.userDocs = this.createHasManyRepositoryFactoryFor('userDocs', userDocsRepositoryGetter,);
    this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
    this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
    this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
    this.vehicles = this.createHasManyRepositoryFactoryFor('vehicles', vehicleRepositoryGetter,);
    this.registerInclusionResolver('vehicles', this.vehicles.inclusionResolver);
  }
}
