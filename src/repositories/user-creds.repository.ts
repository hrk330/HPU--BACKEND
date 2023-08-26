import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserCreds, UserCredsRelations} from '../models';

export class UserCredsRepository extends DefaultCrudRepository<
  UserCreds,
  typeof UserCreds.prototype.id,
  UserCredsRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(UserCreds, dataSource);
  }
}
