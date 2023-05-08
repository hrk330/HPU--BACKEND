import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Vehicle, VehicleRelations} from '../models';

export class VehicleRepository extends DefaultCrudRepository<
  Vehicle,
  typeof Vehicle.prototype.vehicleId,
  VehicleRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Vehicle, dataSource);
  }
}
