import { Count, Filter, Where } from '@loopback/repository';
import { AppUsers, UserCreds } from '../models';
import { AppUsersRepository } from '../repositories';
export declare class AppUsersUserCredsController {
    protected appUsersRepository: AppUsersRepository;
    constructor(appUsersRepository: AppUsersRepository);
    get(id: string, filter?: Filter<UserCreds>): Promise<UserCreds>;
    create(id: typeof AppUsers.prototype.id, userCreds: Omit<UserCreds, 'id'>): Promise<UserCreds>;
    patch(id: string, userCreds: Partial<UserCreds>, where?: Where<UserCreds>): Promise<Count>;
    delete(id: string, where?: Where<UserCreds>): Promise<Count>;
}
