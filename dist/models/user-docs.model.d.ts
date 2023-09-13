import { Entity } from '@loopback/repository';
export declare class UserDocs extends Entity {
    id?: string;
    docType?: string;
    docName?: string;
    docSize?: number;
    mimetype?: string;
    docPath?: string;
    userId: string;
    docStatus?: string;
    comments?: string;
    docUpdate?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<UserDocs>);
}
export interface UserDocsRelations {
}
export type UserDocsWithRelations = UserDocs & UserDocsRelations;
