import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { AdminUsers, AdminUsersRelations, UserTasks, UserCreds } from '../models';
import { UserTasksRepository } from './user-tasks.repository';
import { UserCredsRepository } from './user-creds.repository';
export declare class AdminUsersRepository extends DefaultCrudRepository<AdminUsers, typeof AdminUsers.prototype.id, AdminUsersRelations> {
    protected userTasksRepositoryGetter: Getter<UserTasksRepository>;
    protected userCredsRepositoryGetter: Getter<UserCredsRepository>;
    readonly userTasks: HasManyRepositoryFactory<UserTasks, typeof AdminUsers.prototype.id>;
    readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof AdminUsers.prototype.id>;
    constructor(dataSource: MongoDbDataSource, userTasksRepositoryGetter: Getter<UserTasksRepository>, userCredsRepositoryGetter: Getter<UserCredsRepository>);
}
