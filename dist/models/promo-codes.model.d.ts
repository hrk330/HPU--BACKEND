import { Entity } from '@loopback/repository';
export declare class PromoCodes extends Entity {
    promoId: string;
    promoCode: string;
    discountType: string;
    discountValue: number;
    userLimit: number;
    totalLimit: number;
    totalUsed: number;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<PromoCodes>);
}
export interface PromoCodesRelations {
}
export type PromoCodesWithRelations = PromoCodes & PromoCodesRelations;
