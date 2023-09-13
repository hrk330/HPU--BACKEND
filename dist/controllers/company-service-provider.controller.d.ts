import { Count, Filter, Where } from '@loopback/repository';
import { Company, ServiceProvider } from '../models';
import { CompanyRepository } from '../repositories';
export declare class CompanyServiceProviderController {
    protected companyRepository: CompanyRepository;
    constructor(companyRepository: CompanyRepository);
    find(id: string, filter?: Filter<ServiceProvider>): Promise<ServiceProvider[]>;
    create(id: typeof Company.prototype.id, serviceProvider: Omit<ServiceProvider, 'id'>): Promise<ServiceProvider>;
    patch(id: string, serviceProvider: Partial<ServiceProvider>, where?: Where<ServiceProvider>): Promise<Count>;
    delete(id: string, where?: Where<ServiceProvider>): Promise<Count>;
}
