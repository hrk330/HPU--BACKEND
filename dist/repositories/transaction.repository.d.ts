import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Transaction, TransactionRelations } from '../models';
export declare class TransactionRepository extends DefaultCrudRepository<Transaction, typeof Transaction.prototype.transactionId, TransactionRelations> {
    constructor(dataSource: MongoDbDataSource);
}
