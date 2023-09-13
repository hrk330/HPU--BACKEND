import { Entity } from '@loopback/repository';
import { WithdrawalRequest } from './withdrawal-request.model';
export declare class Account extends Entity {
    accountId: string;
    userId: string;
    balanceAmount: number;
    lastPaymentAmount?: number;
    lastPaymentType?: string;
    lastPaymentDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    withdrawalRequests: WithdrawalRequest[];
    constructor(data?: Partial<Account>);
}
export interface AccountRelations {
}
export type BalanceWithRelations = Account & AccountRelations;
