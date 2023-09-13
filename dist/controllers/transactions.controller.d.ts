import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Transaction } from '../models';
import { TransactionRepository } from '../repositories';
export declare class TransactionsController {
    transactionRepository: TransactionRepository;
    constructor(transactionRepository: TransactionRepository);
    create(transaction: Omit<Transaction, 'transactionId'>): Promise<Transaction>;
    count(where?: Where<Transaction>): Promise<Count>;
    find(filter?: Filter<Transaction>): Promise<Transaction[]>;
    findById(id: string, filter?: FilterExcludingWhere<Transaction>): Promise<Transaction>;
    updateById(id: string, transaction: Transaction): Promise<void>;
    replaceById(id: string, transaction: Transaction): Promise<void>;
    deleteById(id: string): Promise<void>;
}
