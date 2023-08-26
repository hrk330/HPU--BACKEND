import {Entity, model, property, hasMany} from '@loopback/repository';
import {Reminders} from './reminders.model';

@model()
export class Vehicle extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  vehicleId?: string;

  @property({
    type: 'string',
  })
  plateNumber?: string;

  @property({
    type: 'string',
  })
  vehicleType?: string;

  @property({
    type: 'string',
  })
  registerationDate?: string;

  @property({
    type: 'string',
  })
  annualInspectionDate?: string;

  @property({
    type: 'string',
  })
  annualInsuranceDate?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @hasMany(() => Reminders)
  reminders: Reminders[];

  constructor(data?: Partial<Vehicle>) {
    super(data);
  }
}

export interface VehicleRelations {
  // describe navigational properties here
}

export type VehicleWithRelations = Vehicle & VehicleRelations;
