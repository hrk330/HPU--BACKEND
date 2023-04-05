import {
  User
} from '@loopback/authentication-jwt';
import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {AppUsersRelations} from '../models';

export class AppUsersRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.email,
  AppUsersRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(User, dataSource);
  }
}
