import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserTasks, UserTasksRelations} from '../models';

export class UserTasksRepository extends DefaultCrudRepository<
  UserTasks,
  typeof UserTasks.prototype.userTaskId,
  UserTasksRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(UserTasks, dataSource);
  }
}
