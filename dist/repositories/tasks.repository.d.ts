import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Tasks, TasksRelations } from '../models';
export declare class TasksRepository extends DefaultCrudRepository<Tasks, typeof Tasks.prototype.taskId, TasksRelations> {
    constructor(dataSource: MongoDbDataSource);
}
