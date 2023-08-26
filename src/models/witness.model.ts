import {Entity, model, property} from '@loopback/repository';

@model()
export class Witness extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  witnessId?: string;

  @property({
    type: 'string',
    required: true,
  })
  witnessName: string;

  @property({
    type: 'string',
    required: true,
  })
  witnessStatement: string;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'string',
  })
  crashReportId?: string;

  constructor(data?: Partial<Witness>) {
    super(data);
  }
}

export interface WitnessRelations {
  // describe navigational properties here
}

export type WitnessWithRelations = Witness & WitnessRelations;
