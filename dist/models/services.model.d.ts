import { Entity } from '@loopback/repository';
export declare class Services extends Entity {
    serviceId: string;
    serviceName?: string;
    serviceType: string;
    vehicleType?: string;
    price: number;
    serviceFee: number;
    pricePerKm: number;
    salesTax: number;
    platformFee: number;
    isActive?: boolean;
    accidental?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<Services>);
}
export interface ServicesRelations {
}
export type ServicesWithRelations = Services & ServicesRelations;
