import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserDocs, UserDocsRelations} from '../models';

export class UserDocsRepository extends DefaultCrudRepository<
  UserDocs,
  typeof UserDocs.prototype.id,
  UserDocsRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(UserDocs, dataSource);
  }
}
