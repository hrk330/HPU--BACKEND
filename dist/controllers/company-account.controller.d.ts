import { Count, Filter, Where } from '@loopback/repository';
import { Company, Account } from '../models';
import { CompanyRepository } from '../repositories';
export declare class CompanyAccountController {
    protected companyRepository: CompanyRepository;
    constructor(companyRepository: CompanyRepository);
    get(id: string, filter?: Filter<Account>): Promise<Account>;
    create(id: typeof Company.prototype.id, account: Omit<Account, 'accountId'>): Promise<Account>;
    patch(id: string, account: Partial<Account>, where?: Where<Account>): Promise<Count>;
    delete(id: string, where?: Where<Account>): Promise<Count>;
}
