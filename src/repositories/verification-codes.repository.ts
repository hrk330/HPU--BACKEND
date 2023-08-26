import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {VerificationCodes, VerificationCodesRelations} from '../models';

export class VerificationCodesRepository extends DefaultCrudRepository<
  VerificationCodes,
  typeof VerificationCodes.prototype.id,
  VerificationCodesRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(VerificationCodes, dataSource);
  }
}
