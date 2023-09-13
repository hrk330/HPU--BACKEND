import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { VerificationCodes, VerificationCodesRelations } from '../models';
export declare class VerificationCodesRepository extends DefaultCrudRepository<VerificationCodes, typeof VerificationCodes.prototype.id, VerificationCodesRelations> {
    constructor(dataSource: MongoDbDataSource);
}
