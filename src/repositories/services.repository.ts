import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Services, ServicesRelations} from '../models';

export class ServicesRepository extends DefaultCrudRepository<
  Services,
  typeof Services.prototype.serviceId,
  ServicesRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Services, dataSource);
  }
}
