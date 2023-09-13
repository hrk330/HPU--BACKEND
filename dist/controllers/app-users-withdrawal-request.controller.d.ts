import { Count, Filter, Where } from '@loopback/repository';
import { AppUsers, WithdrawalRequest } from '../models';
import { AppUsersRepository } from '../repositories';
export declare class AppUsersWithdrawalRequestController {
    protected appUsersRepository: AppUsersRepository;
    constructor(appUsersRepository: AppUsersRepository);
    find(id: string, filter?: Filter<WithdrawalRequest>): Promise<WithdrawalRequest[]>;
    create(id: typeof AppUsers.prototype.id, withdrawalRequest: Omit<WithdrawalRequest, 'withdrawalRequestId'>): Promise<WithdrawalRequest>;
    patch(id: string, withdrawalRequest: Partial<WithdrawalRequest>, where?: Where<WithdrawalRequest>): Promise<Count>;
    delete(id: string, where?: Where<WithdrawalRequest>): Promise<Count>;
}
