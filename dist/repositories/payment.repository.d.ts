import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Payment, PaymentRelations } from '../models';
export declare class PaymentRepository extends DefaultCrudRepository<Payment, typeof Payment.prototype.paymentId, PaymentRelations> {
    constructor(dataSource: MongoDbDataSource);
}
