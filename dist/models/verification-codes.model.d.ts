import { Entity } from '@loopback/repository';
export declare class VerificationCodes extends Entity {
    id: string;
    type: string;
    key?: string;
    code?: string;
    status?: string;
    lastTry: Date;
    createdAt?: Date;
    expiry?: Date;
    constructor(data?: Partial<VerificationCodes>);
}
export interface VerificationCodesRelations {
}
export type VerificationCodesWithRelations = VerificationCodes & VerificationCodesRelations;
