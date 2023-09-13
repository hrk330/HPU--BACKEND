import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Services, ServicesRelations } from '../models';
export declare class ServicesRepository extends DefaultCrudRepository<Services, typeof Services.prototype.serviceId, ServicesRelations> {
    constructor(dataSource: MongoDbDataSource);
}
