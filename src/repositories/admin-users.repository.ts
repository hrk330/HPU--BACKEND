import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasOneRepositoryFactory, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AdminUsers, AdminUsersRelations, UserTasks, UserCreds} from '../models';
import {UserTasksRepository} from './user-tasks.repository';
import {UserCredsRepository} from './user-creds.repository';

export class AdminUsersRepository extends DefaultCrudRepository<
  AdminUsers,
  typeof AdminUsers.prototype.id,
  AdminUsersRelations
> {

  public readonly userTasks: HasManyRepositoryFactory<UserTasks, typeof AdminUsers.prototype.id>;

  public readonly userCreds: HasOneRepositoryFactory<UserCreds, typeof AdminUsers.prototype.id>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('UserTasksRepository') protected userTasksRepositoryGetter: Getter<UserTasksRepository>, @repository.getter('UserCredsRepository') protected userCredsRepositoryGetter: Getter<UserCredsRepository>,
  ) {
    super(AdminUsers, dataSource);
    this.userCreds = this.createHasOneRepositoryFactoryFor('userCreds', userCredsRepositoryGetter);
    this.registerInclusionResolver('userCreds', this.userCreds.inclusionResolver);
    this.userTasks = this.createHasManyRepositoryFactoryFor('userTasks', userTasksRepositoryGetter,);
    this.registerInclusionResolver('userTasks', this.userTasks.inclusionResolver);
  }
}
