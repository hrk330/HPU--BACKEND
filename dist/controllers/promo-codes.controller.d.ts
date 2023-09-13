import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { PromoCodes } from '../models';
import { PromoCodesRepository } from '../repositories';
export declare class PromoCodesController {
    promoCodesRepository: PromoCodesRepository;
    constructor(promoCodesRepository: PromoCodesRepository);
    create(promoCodes: Omit<PromoCodes, 'promoId'>): Promise<Object>;
    count(where?: Where<PromoCodes>): Promise<Count>;
    find(filter?: Filter<PromoCodes>): Promise<PromoCodes[]>;
    findById(promoId: string, filter?: FilterExcludingWhere<PromoCodes>): Promise<PromoCodes>;
    updateById(requestPromoCode: PromoCodes): Promise<Object>;
    checkPromoExists(promoId: string, promoCode: string): Promise<boolean>;
    generateRandomPromo(): Promise<Object>;
    generateRandomString(length: number): Promise<string>;
    replaceById(promoId: string, promoCodes: PromoCodes): Promise<void>;
    deleteById(promoId: string): Promise<void>;
}
