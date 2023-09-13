import { UserCredentials } from '@loopback/authentication-jwt';
import { Entity } from '@loopback/repository';
import { UserTasks } from './user-tasks.model';
import { UserCreds } from './user-creds.model';
export declare class AdminUsers extends Entity {
    id: string;
    username?: string;
    email: string;
    emailVerified: boolean;
    password: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: string;
    identityNo?: string;
    address1?: string;
    address2?: string;
    country: string;
    state?: string;
    city?: string;
    zipCode?: string;
    phoneNo?: string;
    isBlocked?: string;
    status?: string;
    roleId: string;
    roleName?: string;
    passwordUpdatedAt?: string;
    isMobileVerified?: string;
    isProfileCompleted?: string;
    wrongTries?: number;
    lastSuccessfulLogin?: Date;
    lastUnsuccessfulLogin?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    userCredentials: UserCredentials;
    userTasksList: UserTasks[];
    userTasks: UserTasks[];
    userCreds: UserCreds;
    constructor(data?: Partial<AdminUsers>);
}
export interface AdminUsersRelations {
}
export type AdminUsersWithRelations = AdminUsers & AdminUsersRelations;
