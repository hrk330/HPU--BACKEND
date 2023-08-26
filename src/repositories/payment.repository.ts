import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Payment, PaymentRelations} from '../models';

export class PaymentRepository extends DefaultCrudRepository<
  Payment,
  typeof Payment.prototype.paymentId,
  PaymentRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Payment, dataSource);
  }
}
