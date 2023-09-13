import { Count, Filter, Where } from '@loopback/repository';
import { ServiceProvider, UserDocs } from '../models';
import { ServiceProviderRepository } from '../repositories';
export declare class ServiceProviderUserDocsController {
    protected serviceProviderRepository: ServiceProviderRepository;
    constructor(serviceProviderRepository: ServiceProviderRepository);
    find(id: string, filter?: Filter<UserDocs>): Promise<UserDocs[]>;
    create(id: typeof ServiceProvider.prototype.id, userDocs: Omit<UserDocs, 'id'>): Promise<UserDocs>;
    patch(id: string, userDocs: Partial<UserDocs>, where?: Where<UserDocs>): Promise<Count>;
    delete(id: string, where?: Where<UserDocs>): Promise<Count>;
}
