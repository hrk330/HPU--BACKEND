import { Entity } from '@loopback/repository';
export declare class WithdrawalRequest extends Entity {
    withdrawalRequestId: string;
    serviceProviderId: string;
    serviceProviderUsername?: string;
    serviceProviderName?: string;
    status?: string;
    comments?: string;
    bankName?: string;
    accountNumber?: string;
    accountHolderName?: string;
    swiftCode?: string;
    withdrawalAmount: number;
    unpaidAmount: number;
    rejectionReason?: string;
    profilePic: string;
    createdBy?: string;
    createdAt?: Date;
    updatedAt?: Date;
    userAccountId?: string;
    constructor(data?: Partial<WithdrawalRequest>);
}
export interface WithdrawalRequestRelations {
}
export type WithdrawalRequestsWithRelations = WithdrawalRequest & WithdrawalRequestRelations;
