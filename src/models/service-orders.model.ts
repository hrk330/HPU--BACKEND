import {Entity, model, property} from '@loopback/repository';

@model()
export class ServiceOrders extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
  })
  serviceProviderId?: string;

  @property({
    type: 'string',
  })
  serviceProviderUsername?: string;

  @property({
    type: 'string',
  })
  serviceProviderName?: string;

  @property({
    type: 'string',
  })
  serviceId?: string;

  @property({
    type: 'string',
  })
  serviceType?: string;

  @property({
    type: 'string',
  })
  company?: string;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  amount?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<ServiceOrders>) {
    super(data);
  }
}

export interface ServiceOrdersRelations {
  // describe navigational properties here
}

export type ServiceOrdersWithRelations = ServiceOrders & ServiceOrdersRelations;
