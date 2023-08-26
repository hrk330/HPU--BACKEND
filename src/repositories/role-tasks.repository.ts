import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {RoleTasks, RoleTasksRelations} from '../models';

export class RoleTasksRepository extends DefaultCrudRepository<
  RoleTasks,
  typeof RoleTasks.prototype.roleTaskId,
  RoleTasksRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(RoleTasks, dataSource);
  }
}
