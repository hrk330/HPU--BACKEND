import { Count, Filter, Where } from '@loopback/repository';
import { AppUsers, UserDocs } from '../models';
import { AppUsersRepository } from '../repositories';
export declare class AppUsersUserDocsController {
    protected appUsersRepository: AppUsersRepository;
    constructor(appUsersRepository: AppUsersRepository);
    find(id: string, filter?: Filter<UserDocs>): Promise<UserDocs[]>;
    create(id: typeof AppUsers.prototype.id, userDocs: Omit<UserDocs, 'id'>): Promise<UserDocs>;
    patch(id: string, userDocs: Partial<UserDocs>, where?: Where<UserDocs>): Promise<Count>;
    delete(id: string, where?: Where<UserDocs>): Promise<Count>;
}
