import {Entity, model, property} from '@loopback/repository';

@model()
export class Services extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  serviceId: string;

  @property({
    type: 'string',
  })
  serviceName?: string;

  @property({
    type: 'string',
  })
  serviceType: string;

  @property({
    type: 'string',
  })
  vehicleType?: string;

  @property({
    type: 'number',
  })
  price: number;

  @property({
    type: 'number',
    default: 0,
  })
  serviceFee: number;

  @property({
    type: 'number',
    default: 0,
  })
  pricePerKm: number;

  @property({
    type: 'number',
  })
  salesTax: number;

  @property({
    type: 'number',
    default: 0,
  })
  platformFee: number;

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

  constructor(data?: Partial<Services>) {
    super(data);
  }
}

export interface ServicesRelations {
  // describe navigational properties here
}

export type ServicesWithRelations = Services & ServicesRelations;
