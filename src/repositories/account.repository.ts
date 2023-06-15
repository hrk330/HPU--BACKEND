import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Account, AccountRelations} from '../models';

export class AccountRepository extends DefaultCrudRepository<
  Account,
  typeof Account.prototype.accountId,
  AccountRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Account, dataSource);
  }
}
