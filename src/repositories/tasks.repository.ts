import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Tasks, TasksRelations} from '../models';

export class TasksRepository extends DefaultCrudRepository<
  Tasks,
  typeof Tasks.prototype.taskId,
  TasksRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Tasks, dataSource);
  }
}
