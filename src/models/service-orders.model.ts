import {Entity, model, property} from '@loopback/repository';

@model()
export class ServiceOrders extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  serviceOrderId?: string;

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
  userId?: string;

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
  serviceName?: string;

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
  pickupLocation?: string;

  @property({
    type: 'string',
  })
  pickupLocationCoordinates?: string;

  @property({
    type: 'string',
  })
  dropLocation?: string;

  @property({
    type: 'string',
  })
  dropLocationCoordinates?: string;

  @property({
    type: 'string',
  })
  startingTime?: string;

  @property({
    type: 'string',
  })
  arrivalTime?: string;

  @property({
    type: 'string',
  })
  endingTime?: string;

  @property({
    type: 'string',
  })
  distance?: string;

  @property({
    type: 'string',
  })
  extraDistance?: string;

  @property({
    type: 'string',
  })
  instructions?: string;

  @property({
    type: 'string',
  })
  promoId?: string;

  @property({
    type: 'string',
  })
  promoCode?: string;

  @property({
    type: 'string',
  })
  discountValue?: string;

  @property({
    type: 'string',
  })
  discountType?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  taxPercentage?: string;

  @property({
    type: 'string',
  })
  taxAmount?: string;

  @property({
    type: 'string',
  })
  grossAmount?: string;

  @property({
    type: 'string',
  })
  netAmount?: string;

  @property({
    type: 'string',
  })
  paymentMethod?: string;

  @property({
    type: 'string',
  })
  rating?: string;

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
