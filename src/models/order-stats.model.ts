import {Model, model, property} from '@loopback/repository';

@model()
export class OrderStats extends Model {
  @property({
    type: 'number',
  })
  totalOrders?: number;

  @property({
    type: 'number',
  })
  completedOrders?: number;

  @property({
    type: 'number',
  })
  canceledOrders?: number;

  constructor(data?: Partial<OrderStats>) {
    super(data);
  }
}

export interface OrderStatsRelations {
  // describe navigational properties here
}

export type OrderStatsWithRelations = OrderStats & OrderStatsRelations;
