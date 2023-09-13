import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { RoleTasks, RoleTasksRelations } from '../models';
export declare class RoleTasksRepository extends DefaultCrudRepository<RoleTasks, typeof RoleTasks.prototype.roleTaskId, RoleTasksRelations> {
    constructor(dataSource: MongoDbDataSource);
}
