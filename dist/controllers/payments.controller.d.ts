import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Payment } from '../models';
import { PaymentRepository } from '../repositories';
export declare class PaymentsController {
    paymentRepository: PaymentRepository;
    constructor(paymentRepository: PaymentRepository);
    create(payment: Omit<Payment, 'paymentId'>): Promise<Payment>;
    count(where?: Where<Payment>): Promise<Count>;
    find(filter?: Filter<Payment>): Promise<Payment[]>;
    findById(id: string, filter?: FilterExcludingWhere<Payment>): Promise<Payment>;
    updateById(id: string, payment: Payment): Promise<void>;
    replaceById(id: string, payment: Payment): Promise<void>;
    deleteById(id: string): Promise<void>;
}
