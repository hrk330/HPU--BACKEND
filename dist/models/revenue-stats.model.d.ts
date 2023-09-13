import { Model } from '@loopback/repository';
export declare class RevenueStats extends Model {
    revenue?: number;
    earning?: number;
    coffer?: number;
    outstandingCash?: number;
    constructor(data?: Partial<RevenueStats>);
}
export interface RevenueStatsRelations {
}
export type RevenueStatsWithRelations = RevenueStats & RevenueStatsRelations;
