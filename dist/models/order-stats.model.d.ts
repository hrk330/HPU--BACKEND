import { Model } from '@loopback/repository';
export declare class OrderStats extends Model {
    totalOrders?: number;
    completedOrders?: number;
    canceledOrders?: number;
    constructor(data?: Partial<OrderStats>);
}
export interface OrderStatsRelations {
}
export type OrderStatsWithRelations = OrderStats & OrderStatsRelations;
