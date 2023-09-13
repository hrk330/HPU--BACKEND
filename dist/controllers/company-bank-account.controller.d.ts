import { Count, Filter, Where } from '@loopback/repository';
import { Company, BankAccount } from '../models';
import { CompanyRepository } from '../repositories';
export declare class CompanyBankAccountController {
    protected companyRepository: CompanyRepository;
    constructor(companyRepository: CompanyRepository);
    get(id: string, filter?: Filter<BankAccount>): Promise<BankAccount>;
    create(id: typeof Company.prototype.id, bankAccount: Omit<BankAccount, 'bankAccountId'>): Promise<BankAccount>;
    patch(id: string, bankAccount: Partial<BankAccount>, where?: Where<BankAccount>): Promise<Count>;
    delete(id: string, where?: Where<BankAccount>): Promise<Count>;
}
