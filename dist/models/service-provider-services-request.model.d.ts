import { Model } from '@loopback/repository';
import { ServiceProviderServices } from './service-provider-services.model';
export declare class ServiceProviderServicesRequest extends Model {
    serviceProviderServicesList: ServiceProviderServices[];
    constructor(data?: Partial<ServiceProviderServicesRequest>);
}
export interface ServiceProviderServicesRequestRelations {
}
export type ServiceProviderServicesRequestWithRelations = ServiceProviderServicesRequest & ServiceProviderServicesRequestRelations;
