import { Entity } from '@loopback/repository';
import { UserDocs } from './user-docs.model';
import { Witness } from './witness.model';
export declare class CrashReports extends Entity {
    crashReportId?: string;
    ownerName: string;
    vehicleId?: string;
    vehicleType: string;
    plateNumber?: string;
    userId: string;
    serviceProviderId: string;
    adminUserId: string;
    location?: string;
    damageDescription?: string;
    incidentDescription?: string;
    ownerStatement?: string;
    otherDriverName?: string;
    otherVehiclePlateNumber?: string;
    otherVehicleMake?: string;
    otherVehicleInsuranceCompany?: string;
    otherDamageDescription?: string;
    otherStatement?: string;
    witnessName?: string;
    witnessStatement?: string;
    assessorName?: string;
    serviceOrderId?: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    crashReportDocIds: string[];
    otherPartyDocIds: string[];
    crashReportDocs: UserDocs[];
    witnessList: Witness[];
    otherPartyDocs: UserDocs[];
    witnesses: Witness[];
    constructor(data?: Partial<CrashReports>);
}
export interface CrashReportsRelations {
}
export type CrashReportsWithRelations = CrashReports & CrashReportsRelations;
