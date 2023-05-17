import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AdminUsers, AdminUsersRelations, UserTasks} from '../models';
import {UserTasksRepository} from './user-tasks.repository';

export class AdminUsersRepository extends DefaultCrudRepository<
  AdminUsers,
  typeof AdminUsers.prototype.adminUsersId,
  AdminUsersRelations
> {

  public readonly userTasks: HasManyRepositoryFactory<UserTasks, typeof AdminUsers.prototype.adminUsersId>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserTasksRepository') protected userTasksRepositoryGetter: Getter<UserTasksRepository>,
  ) {
    super(AdminUsers, dataSource);
    this.userTasks = this.createHasManyRepositoryFactoryFor('userTasks', userTasksRepositoryGetter,);
    this.registerInclusionResolver('userTasks', this.userTasks.inclusionResolver);
  }
}
