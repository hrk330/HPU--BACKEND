import { Count, Filter, Where } from '@loopback/repository';
import { AppUsers, Account } from '../models';
import { AppUsersRepository } from '../repositories';
export declare class AppUsersAccountController {
    protected appUsersRepository: AppUsersRepository;
    constructor(appUsersRepository: AppUsersRepository);
    get(id: string, filter?: Filter<Account>): Promise<Account>;
    create(id: typeof AppUsers.prototype.id, account: Omit<Account, 'accountId'>): Promise<Account>;
    patch(id: string, account: Partial<Account>, where?: Where<Account>): Promise<Count>;
    delete(id: string, where?: Where<Account>): Promise<Count>;
}
