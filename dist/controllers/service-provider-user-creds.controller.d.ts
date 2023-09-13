import { Count, Filter, Where } from '@loopback/repository';
import { ServiceProvider, UserCreds } from '../models';
import { ServiceProviderRepository } from '../repositories';
export declare class ServiceProviderUserCredsController {
    protected serviceProviderRepository: ServiceProviderRepository;
    constructor(serviceProviderRepository: ServiceProviderRepository);
    get(id: string, filter?: Filter<UserCreds>): Promise<UserCreds>;
    create(id: typeof ServiceProvider.prototype.id, userCreds: Omit<UserCreds, 'id'>): Promise<UserCreds>;
    patch(id: string, userCreds: Partial<UserCreds>, where?: Where<UserCreds>): Promise<Count>;
    delete(id: string, where?: Where<UserCreds>): Promise<Count>;
}
