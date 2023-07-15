import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Vehicle, VehicleRelations, Reminders} from '../models';
import {RemindersRepository} from './reminders.repository';

export class VehicleRepository extends DefaultCrudRepository<
  Vehicle,
  typeof Vehicle.prototype.vehicleId,
  VehicleRelations
> {

  public readonly reminders: HasManyRepositoryFactory<Reminders, typeof Vehicle.prototype.vehicleId>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('RemindersRepository') protected remindersRepositoryGetter: Getter<RemindersRepository>,
  ) {
    super(Vehicle, dataSource);
    this.reminders = this.createHasManyRepositoryFactoryFor('reminders', remindersRepositoryGetter,);
    this.registerInclusionResolver('reminders', this.reminders.inclusionResolver);
  }
}
