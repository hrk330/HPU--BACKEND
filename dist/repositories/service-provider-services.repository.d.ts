import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { ServiceProviderServices, ServiceProviderServicesRelations } from '../models';
export declare class ServiceProviderServicesRepository extends DefaultCrudRepository<ServiceProviderServices, typeof ServiceProviderServices.prototype.id, ServiceProviderServicesRelations> {
    constructor(dataSource: MongoDbDataSource);
}
