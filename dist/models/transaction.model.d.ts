import { Entity } from '@loopback/repository';
export declare class Transaction extends Entity {
    transactionId?: string;
    serviceOrderId: string;
    transactionProcessedDateTime: string;
    cardBin: string;
    timezone: string;
    processorNetworkInformation: string;
    oid: string;
    country: string;
    expiryMonth: string;
    hashAlgorithm: string;
    endpointTransactionId: string;
    currency: string;
    processorResponseCode: string;
    chargeTotal: string;
    terminalId: string;
    associationResponseCode: string;
    approvalCode: string;
    expiryYear: string;
    responseHash: string;
    transactionDateInSeconds: string;
    installmentsInterest: string;
    bankName: string;
    CardBrand: string;
    referenceNumber: string;
    transactionType: string;
    paymentMethod: string;
    transactionDateTime: string;
    cardNumber: string;
    ipgTransactionId: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    [prop: string]: any;
    constructor(data?: Partial<Transaction>);
}
export interface TransactionRelations {
}
export type TransactionWithRelations = Transaction & TransactionRelations;
