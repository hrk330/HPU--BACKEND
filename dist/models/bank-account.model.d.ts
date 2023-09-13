import { Entity } from '@loopback/repository';
export declare class BankAccount extends Entity {
    bankAccountId?: string;
    userId?: string;
    accountHolderName: string;
    accountNumber: string;
    bankName: string;
    accountType: string;
    address?: string;
    zipCode?: string;
    status?: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<BankAccount>);
}
export interface BankAccountRelations {
}
export type BankAccountWithRelations = BankAccount & BankAccountRelations;
