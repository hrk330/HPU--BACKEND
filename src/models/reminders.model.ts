import {Entity, model, property} from '@loopback/repository';

@model()
export class Reminders extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  reminderId?: string;

  @property({
    type: 'string',
  })
  vehicleId?: string;

  @property({
    type: 'string',
  })
  plateNumber?: string;
  
  @property({
    type: 'string',
  })
  reminderType?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'string',
  })
  comments?: string;

  @property({
    type: 'boolean',
    default: true,
  })
  isActive?: boolean;

  @property({
    type: 'date',
  })
  reminderDate?: Date;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<Reminders>) {
    super(data);
  }
}

export interface RemindersRelations {
  // describe navigational properties here
}

export type RemindersWithRelations = Reminders & RemindersRelations;
