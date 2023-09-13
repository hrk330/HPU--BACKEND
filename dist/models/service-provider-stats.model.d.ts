import { Model } from '@loopback/repository';
export declare class ServiceProviderStats extends Model {
    totalServiceProviders?: number;
    approvedServiceProviders?: number;
    rejectedServiceProviders?: number;
    serviceProviderId?: string;
    serviceProviderName?: string;
    amount?: number;
    status?: number;
    joinedDateTime?: Date;
    constructor(data?: Partial<ServiceProviderStats>);
}
export interface ServiceProviderStatsRelations {
}
export type ServiceProviderStatsWithRelations = ServiceProviderStats & ServiceProviderStatsRelations;
