import {Getter, inject} from '@loopback/core';
import {DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AppUsers, AppUsersRelations, UserCreds, Vehicle, UserDocs} from '../models';
import {UserCredsRepository} from './user-creds.repository';
import {VehicleRepository} from './vehicle.repository';
import {UserDocsRepository} from './user-docs.repository';

export class AppUsersRepository extends DefaultCrudRepository<
  AppUsers,
  typeof AppUsers.prototype.id,
  AppUsersRelations
> {

  public readonly vehicles: HasManyRepositoryFactory<Vehicle, typeof AppUsers.prototype.id>;

  public readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof AppUsers.prototype.id>;

  public readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof AppUsers.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('VehicleRepository') protected vehicleRepositoryGetter: Getter<VehicleRepository>, @repository.getter('UserCredsRepository') protected userCredsRepositoryGetter: Getter<UserCredsRepository>, @repository.getter('UserDocsRepository') protected userDocsRepositoryGetter: Getter<UserDocsRepository>,
  ) {
    super(AppUsers, dataSource);
    this.userDocs = this.createHasManyRepositoryFactoryFor('userDocs', userDocsRepositoryGetter,);
    this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
    this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
    this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
    this.vehicles = this.createHasManyRepositoryFactoryFor('vehicles', vehicleRepositoryGetter,);
    this.registerInclusionResolver('vehicles', this.vehicles.inclusionResolver);
  }
}
