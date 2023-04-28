import {Entity, model, property} from '@loopback/repository';

@model()
export class Services extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

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
  price?: string;

  @property({
    type: 'string',
    default: "Y"
  })
  isActive?: string;

  @property({
    type: 'date',
    default: "$now"
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
