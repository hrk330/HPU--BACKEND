import { Entity } from '@loopback/repository';
export declare class UserCreds extends Entity {
    id: string;
    password: string;
    salt: string;
    userId: string;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<UserCreds>);
}
export interface UserCredsRelations {
}
export type UserCredsWithRelations = UserCreds & UserCredsRelations;
