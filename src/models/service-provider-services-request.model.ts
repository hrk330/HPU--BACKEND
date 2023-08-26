import {Model, model, property} from '@loopback/repository';
import {ServiceProviderServices} from './service-provider-services.model';

@model()
export class ServiceProviderServicesRequest extends Model {
  @property({
    type: 'array',
    itemType: 'object',
  })
  serviceProviderServicesList: ServiceProviderServices[];

  constructor(data?: Partial<ServiceProviderServicesRequest>) {
    super(data);
  }
}

export interface ServiceProviderServicesRequestRelations {
  // describe navigational properties here
}

export type ServiceProviderServicesRequestWithRelations =
  ServiceProviderServicesRequest & ServiceProviderServicesRequestRelations;
