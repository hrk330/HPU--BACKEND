import { Model } from '@loopback/repository';
export declare class TransactionResponse extends Model {
    txndate_processed: string;
    ccbin: string;
    timezone: string;
    processor_network_information: string;
    oid: string;
    cccountry: string;
    expmonth: string;
    hash_algorithm: string;
    endpointTransactionId: string;
    currency: string;
    processor_response_code: string;
    chargetotal: string;
    terminal_id: string;
    associationResponseCode: string;
    approval_code: string;
    expyear: string;
    response_hash: string;
    tdate: string;
    installments_interest: string;
    bname: string;
    ccbrand: string;
    refnumber: string;
    txntype: string;
    paymentMethod: string;
    txndatetime: string;
    cardnumber: string;
    ipgTransactionId: string;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    [prop: string]: any;
    constructor(data?: Partial<TransactionResponse>);
}
export interface TransactionResponseRelations {
}
export type TransactionResponseWithRelations = TransactionResponse & TransactionResponseRelations;
