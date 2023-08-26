import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Witness, WitnessRelations} from '../models';

export class WitnessRepository extends DefaultCrudRepository<
  Witness,
  typeof Witness.prototype.witnessId,
  WitnessRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Witness, dataSource);
  }
}
