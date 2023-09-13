import { Entity } from '@loopback/repository';
export declare class Payment extends Entity {
    paymentId?: string;
    payerId: string;
    paymentOrderId: string;
    receiverId: string;
    withdrawalRequestId: string;
    paymentType: string;
    paymentAmount: number;
    paymentStatus: string;
    platformFee: number;
    discountAmount?: number;
    taxAmount: number;
    grossAmount: number;
    netAmount: number;
    serviceFee: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<Payment>);
}
export interface PaymentRelations {
}
export type PaymentWithRelations = Payment & PaymentRelations;
