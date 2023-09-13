import { Count, Filter, Where } from '@loopback/repository';
import { Company, UserCreds } from '../models';
import { CompanyRepository } from '../repositories';
export declare class CompanyUserCredsController {
    protected companyRepository: CompanyRepository;
    constructor(companyRepository: CompanyRepository);
    get(id: string, filter?: Filter<UserCreds>): Promise<UserCreds>;
    create(id: typeof Company.prototype.id, userCreds: Omit<UserCreds, 'id'>): Promise<UserCreds>;
    patch(id: string, userCreds: Partial<UserCreds>, where?: Where<UserCreds>): Promise<Count>;
    delete(id: string, where?: Where<UserCreds>): Promise<Count>;
}
