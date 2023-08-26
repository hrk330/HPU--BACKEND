import {Entity, model, property} from '@loopback/repository';

@model()
export class ServiceProviderServices extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  serviceId: string;

  @property({
    type: 'string',
  })
  serviceName?: string;

  @property({
    type: 'string',
  })
  serviceType?: string;

  @property({
    type: 'string',
  })
  vehicleType?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;

  @property({
    type: 'boolean',
  })
  accidental?: boolean;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<ServiceProviderServices>) {
    super(data);
  }
}

export interface ServiceProviderServicesRelations {
  // describe navigational properties here
}

export type ServiceProviderServicesWithRelations = ServiceProviderServices &
  ServiceProviderServicesRelations;
