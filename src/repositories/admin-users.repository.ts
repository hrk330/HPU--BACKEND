import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AdminUsers, AdminUsersRelations, UserTasks} from '../models';
import {UserTasksRepository} from './user-tasks.repository';

export class AdminUsersRepository extends DefaultCrudRepository<
  AdminUsers,
  typeof AdminUsers.prototype.id,
  AdminUsersRelations
> {

  public readonly userTasks: HasOneRepositoryFactory<UserTasks, typeof AdminUsers.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserTasksRepository') protected userTasksRepositoryGetter: Getter<UserTasksRepository>,
  ) {
    super(AdminUsers, dataSource);
    this.userTasks = this.createHasOneRepositoryFactoryFor('userTasks', userTasksRepositoryGetter);
    this.registerInclusionResolver('userTasks', this.userTasks.inclusionResolver);
  }
}
