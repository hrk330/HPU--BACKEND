import { Model } from '@loopback/repository';
export declare class CredentialsRequest extends Model {
    id?: string;
    email: string;
    password: string;
    oldPassword?: string;
    constructor(data?: Partial<CredentialsRequest>);
}
export declare const CredentialsRequestBody: {
    description: string;
    required: boolean;
    content: {
        'application/json': {
            schema: import("@loopback/rest").SchemaRef;
        };
    };
};
export interface CredentialsRequestRelations {
}
export type CredentialsRequestWithRelations = CredentialsRequest & CredentialsRequestRelations;
