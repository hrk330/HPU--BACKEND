import { Entity } from '@loopback/repository';
import { Reminders } from './reminders.model';
export declare class Vehicle extends Entity {
    vehicleId?: string;
    plateNumber?: string;
    vehicleType?: string;
    registerationDate?: string;
    annualInspectionDate?: string;
    annualInsuranceDate?: string;
    userId?: string;
    createdAt?: Date;
    updatedAt?: Date;
    reminders: Reminders[];
    constructor(data?: Partial<Vehicle>);
}
export interface VehicleRelations {
}
export type VehicleWithRelations = Vehicle & VehicleRelations;
