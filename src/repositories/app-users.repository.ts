import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AppUsers, AppUsersRelations} from '../models';

export class AppUsersRepository extends DefaultCrudRepository<
  AppUsers,
  typeof AppUsers.prototype.userId,
  AppUsersRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(AppUsers, dataSource);
  }
}
