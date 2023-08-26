import {Getter, inject} from '@loopback/core';
import {
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {RoleTasks, Roles, RolesRelations} from '../models';
import {RoleTasksRepository} from './role-tasks.repository';

export class RolesRepository extends DefaultCrudRepository<
  Roles,
  typeof Roles.prototype.roleId,
  RolesRelations
> {
  public readonly roleTasks: HasManyRepositoryFactory<
    RoleTasks,
    typeof Roles.prototype.roleId
  >;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
    @repository.getter('RoleTasksRepository')
    protected roleTasksRepositoryGetter: Getter<RoleTasksRepository>,
  ) {
    super(Roles, dataSource);
    this.roleTasks = this.createHasManyRepositoryFactoryFor(
      'roleTaskList',
      roleTasksRepositoryGetter,
    );
    this.registerInclusionResolver(
      'roleTasks',
      this.roleTasks.inclusionResolver,
    );
  }
}
