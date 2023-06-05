import {Entity, model, property} from '@loopback/repository';

@model()
export class ServiceOrders extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  serviceOrderId: string;

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
  vehicleType?: string;

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
    type: 'number',
  })
  distance?: number;

  @property({
    type: 'number',
  })
  extraDistance?: number;

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
  discountValue?: number;

  @property({
    type: 'string',
  })
  discountType?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  taxPercentage?: number;

  @property({
    type: 'number',
  })
  taxAmount?: number;

  @property({
    type: 'number',
  })
  grossAmount?: number;

  @property({
    type: 'number',
  })
  netAmount?: number;

  @property({
    type: 'string',
  })
  paymentMethod?: string;

  @property({
    type: 'number',
  })
  rating?: number;

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
