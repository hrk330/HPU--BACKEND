import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Vehicle, VehicleRelations, Reminders } from '../models';
import { RemindersRepository } from './reminders.repository';
export declare class VehicleRepository extends DefaultCrudRepository<Vehicle, typeof Vehicle.prototype.vehicleId, VehicleRelations> {
    protected remindersRepositoryGetter: Getter<RemindersRepository>;
    readonly reminders: HasManyRepositoryFactory<Reminders, typeof Vehicle.prototype.vehicleId>;
    constructor(dataSource: MongoDbDataSource, remindersRepositoryGetter: Getter<RemindersRepository>);
}
