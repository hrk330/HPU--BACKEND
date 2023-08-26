import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PromoCodes, PromoCodesRelations} from '../models';

export class PromoCodesRepository extends DefaultCrudRepository<
  PromoCodes,
  typeof PromoCodes.prototype.promoId,
  PromoCodesRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(PromoCodes, dataSource);
  }
}
