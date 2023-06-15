import {Model, model, property} from '@loopback/repository';
import { Payment } from './payment.model';
import { ServiceOrders } from './service-orders.model';

@model()
export class OrderRequest extends Model {
  @property({
    type: 'object',
  })
  serviceOrder: ServiceOrders;

  @property({
    type: 'object',
  })
  payment: Payment;


  constructor(data?: Partial<OrderRequest>) {
    super(data);
  }
}

export interface OrderRequestRelations {
  // describe navigational properties here
}

export type OrderRequestWithRelations = OrderRequest & OrderRequestRelations;
