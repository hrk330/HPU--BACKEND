import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { BankAccount, BankAccountRelations } from '../models';
export declare class BankAccountRepository extends DefaultCrudRepository<BankAccount, typeof BankAccount.prototype.bankAccountId, BankAccountRelations> {
    constructor(dataSource: MongoDbDataSource);
}
