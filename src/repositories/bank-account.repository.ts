import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {BankAccount, BankAccountRelations} from '../models';

export class BankAccountRepository extends DefaultCrudRepository<
  BankAccount,
  typeof BankAccount.prototype.bankAccountId,
  BankAccountRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(BankAccount, dataSource);
  }
}
