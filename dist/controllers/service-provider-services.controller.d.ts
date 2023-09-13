import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { ServiceProviderServices, ServiceProviderServicesRequest, Services } from '../models';
import { ServiceProviderServicesRepository, ServicesRepository } from '../repositories';
export declare class ServiceProviderServicesController {
    serviceProviderServicesRepository: ServiceProviderServicesRepository;
    servicesRepository: ServicesRepository;
    constructor(serviceProviderServicesRepository: ServiceProviderServicesRepository, servicesRepository: ServicesRepository);
    create(serviceProviderServicesRequest: ServiceProviderServicesRequest): Promise<string>;
    updateServiceProviderServices(serviceProviderServicesRequest: ServiceProviderServicesRequest): Promise<string>;
    checkServicesExist(servicesArray: Array<string>): Promise<Array<Services>>;
    checkServiceProviderServiceExist(serviceId: string, userId: string): Promise<Array<ServiceProviderServices>>;
    count(where?: Where<ServiceProviderServices>): Promise<Count>;
    find(filter?: Filter<ServiceProviderServices>): Promise<ServiceProviderServices[]>;
    findById(id: string, filter?: FilterExcludingWhere<ServiceProviderServices>): Promise<ServiceProviderServices>;
    updateById(id: string, serviceProviderServices: ServiceProviderServices): Promise<void>;
    replaceById(id: string, serviceProviderServices: ServiceProviderServices): Promise<void>;
    deleteById(id: string): Promise<void>;
}
