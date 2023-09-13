import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Services } from '../models';
import { ServicesRepository } from '../repositories';
export declare class ServicesController {
    servicesRepository: ServicesRepository;
    constructor(servicesRepository: ServicesRepository);
    create(services: Omit<Services, 'serviceId'>): Promise<Services>;
    count(where?: Where<Services>): Promise<Count>;
    find(filter?: Filter<Services>): Promise<Services[]>;
    findById(id: string, filter?: FilterExcludingWhere<Services>): Promise<Services>;
    updateById(id: string, services: Services): Promise<object>;
    replaceById(id: string, services: Services): Promise<void>;
    deleteById(id: string): Promise<void>;
}
