import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Witness, WitnessRelations } from '../models';
export declare class WitnessRepository extends DefaultCrudRepository<Witness, typeof Witness.prototype.witnessId, WitnessRelations> {
    constructor(dataSource: MongoDbDataSource);
}
