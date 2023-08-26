import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {
  ServiceProviderServices,
  ServiceProviderServicesRelations,
} from '../models';

export class ServiceProviderServicesRepository extends DefaultCrudRepository<
  ServiceProviderServices,
  typeof ServiceProviderServices.prototype.id,
  ServiceProviderServicesRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(ServiceProviderServices, dataSource);
  }
}
