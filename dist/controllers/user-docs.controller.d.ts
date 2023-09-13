import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { UserDocs } from '../models';
import { UserDocsRepository } from '../repositories';
export declare class UserDocsController {
    userDocsRepository: UserDocsRepository;
    constructor(userDocsRepository: UserDocsRepository);
    create(userDocs: Omit<UserDocs, 'id'>): Promise<UserDocs>;
    count(where?: Where<UserDocs>): Promise<Count>;
    find(filter?: Filter<UserDocs>): Promise<UserDocs[]>;
    findById(id: string, filter?: FilterExcludingWhere<UserDocs>): Promise<UserDocs>;
    updateById(id: string, userDocs: UserDocs): Promise<string>;
    replaceById(id: string, userDocs: UserDocs): Promise<void>;
    deleteById(id: string): Promise<void>;
}
