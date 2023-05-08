import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ServiceOrders, ServiceOrdersRelations} from '../models';

export class ServiceOrdersRepository extends DefaultCrudRepository<
  ServiceOrders,
  typeof ServiceOrders.prototype.serviceOrderId,
  ServiceOrdersRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(ServiceOrders, dataSource);
  }
}
