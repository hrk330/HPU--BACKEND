import { Model } from '@loopback/repository';
export declare class VerificationRequestObject extends Model {
    email: string;
    userId: string;
    verificationCode: string;
    phoneNo: string;
    type: string;
    userType: string;
    constructor(data?: Partial<VerificationRequestObject>);
}
export interface VerificationRequestObjectRelations {
}
export type VerificationRequestObjectWithRelations = VerificationRequestObject & VerificationRequestObjectRelations;
