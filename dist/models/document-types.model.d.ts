import { Entity } from '@loopback/repository';
export declare class DocumentTypes extends Entity {
    docTypeId?: string;
    docType: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<DocumentTypes>);
}
export interface DocumentTypesRelations {
}
export type DocumentTypesWithRelations = DocumentTypes & DocumentTypesRelations;
