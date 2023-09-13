import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { PromoCodes, PromoCodesRelations } from '../models';
export declare class PromoCodesRepository extends DefaultCrudRepository<PromoCodes, typeof PromoCodes.prototype.promoId, PromoCodesRelations> {
    constructor(dataSource: MongoDbDataSource);
}
