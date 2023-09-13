import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { UserTasks, UserTasksRelations } from '../models';
export declare class UserTasksRepository extends DefaultCrudRepository<UserTasks, typeof UserTasks.prototype.userTaskId, UserTasksRelations> {
    constructor(dataSource: MongoDbDataSource);
}
