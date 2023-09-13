import { UserCredentials } from '@loopback/authentication-jwt';
import { Entity } from '@loopback/repository';
import { UserCreds } from './user-creds.model';
import { Account } from './account.model';
import { BankAccount } from './bank-account.model';
import { ServiceProvider } from './service-provider.model';
export declare class Company extends Entity {
    id: string;
    password: string;
    companyName: string;
    companyType: string;
    email: string;
    phoneNo: string;
    profilePic?: string;
    address1?: string;
    address2?: string;
    country: string;
    state?: string;
    city?: string;
    zipCode?: string;
    taxRegistrationNo?: string;
    status?: string;
    totalRiders?: number;
    totalOrders?: number;
    completionRate?: number;
    totalEarning?: number;
    totalRevenue?: number;
    balance?: number;
    companyLocation: string;
    companyLocationCoordinates: string;
    bankAccountInfo: BankAccount;
    createdAt?: Date;
    updatedAt?: Date;
    userCredentials: UserCredentials;
    userCreds: UserCreds;
    account: Account;
    bankAccount: BankAccount;
    serviceProviders: ServiceProvider[];
    constructor(data?: Partial<Company>);
}
export interface CompanyRelations {
}
export type CompanyWithRelations = Company & CompanyRelations;
