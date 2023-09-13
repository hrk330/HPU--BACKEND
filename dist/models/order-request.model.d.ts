import { Model } from '@loopback/repository';
import { Payment } from './payment.model';
import { ServiceOrders } from './service-orders.model';
export declare class OrderRequest extends Model {
    serviceOrder: ServiceOrders;
    payment: Payment;
    constructor(data?: Partial<OrderRequest>);
}
export interface OrderRequestRelations {
}
export type OrderRequestWithRelations = OrderRequest & OrderRequestRelations;
