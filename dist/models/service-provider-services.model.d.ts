import { Entity } from '@loopback/repository';
export declare class ServiceProviderServices extends Entity {
    id: string;
    serviceId: string;
    serviceName?: string;
    serviceType?: string;
    vehicleType?: string;
    userId: string;
    isActive?: boolean;
    accidental?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<ServiceProviderServices>);
}
export interface ServiceProviderServicesRelations {
}
export type ServiceProviderServicesWithRelations = ServiceProviderServices & ServiceProviderServicesRelations;
