import { Entity } from '@loopback/repository';
export declare class Witness extends Entity {
    witnessId?: string;
    witnessName: string;
    witnessStatement: string;
    createdAt?: Date;
    updatedAt?: Date;
    crashReportId?: string;
    constructor(data?: Partial<Witness>);
}
export interface WitnessRelations {
}
export type WitnessWithRelations = Witness & WitnessRelations;
