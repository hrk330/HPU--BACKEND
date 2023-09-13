import { AppUsers, Company, ServiceProvider, VerificationRequestObject } from '../models';
export declare class AccCreateEmails {
    sendCompanyAccCreateMail(savedCompany: Company, company: Omit<Company, 'companyId'>): Promise<void>;
    sendRiderAccCreateMail(savedUser: ServiceProvider, serviceProvider: Omit<ServiceProvider, 'id'>): Promise<void>;
    sendUserAccCreateByAdminEmail(savedUser: AppUsers, newUserRequest: AppUsers): Promise<void>;
    sendUserAccCreateByAppVerificationEmail(verificationRequestObject: VerificationRequestObject): Promise<void>;
}
