import { TokenService } from '@loopback/authentication';
import { MyUserService } from '@loopback/authentication-jwt';
import { Filter } from '@loopback/repository';
import { Company, CredentialsRequest, ServiceOrders, ServiceProvider } from '../models';
import { CompanyRepository, ServiceOrdersRepository, ServiceProviderRepository, ServicesRepository } from '../repositories';
export declare class CompanyController {
    companyRepository: CompanyRepository;
    jwtService: TokenService;
    userService: MyUserService;
    serviceOrdersRepository: ServiceOrdersRepository;
    servicesRepository: ServicesRepository;
    serviceProviderRepository: ServiceProviderRepository;
    private AccCreateEmails;
    constructor(companyRepository: CompanyRepository, jwtService: TokenService, userService: MyUserService, serviceOrdersRepository: ServiceOrdersRepository, servicesRepository: ServicesRepository, serviceProviderRepository: ServiceProviderRepository);
    login(credentials: CredentialsRequest): Promise<String>;
    create(company: Omit<Company, 'companyId'>): Promise<string>;
    changePassword(credentialsRequest: CredentialsRequest): Promise<String>;
    find(filter?: Filter<Company>): Promise<string>;
    findById(id: string): Promise<string>;
    updateById(id: string, company: Company): Promise<string>;
    findCompanyServiceProviders(companyId: string, filter?: Filter<ServiceProvider>): Promise<string>;
    findCompanyOrders(companyId: string, filter?: Filter<ServiceOrders>): Promise<string>;
    getServiceIdArrayForOrder(companyType: string): Promise<string[]>;
}
