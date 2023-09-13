import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { RoleTasks, Roles, RolesRelations } from '../models';
import { RoleTasksRepository } from './role-tasks.repository';
export declare class RolesRepository extends DefaultCrudRepository<Roles, typeof Roles.prototype.roleId, RolesRelations> {
    protected roleTasksRepositoryGetter: Getter<RoleTasksRepository>;
    readonly roleTasks: HasManyRepositoryFactory<RoleTasks, typeof Roles.prototype.roleId>;
    constructor(dataSource: MongoDbDataSource, roleTasksRepositoryGetter: Getter<RoleTasksRepository>);
}
