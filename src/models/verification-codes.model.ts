import {Entity, model, property} from '@loopback/repository';

@model()
export class VerificationCodes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  type: string;

  @property({
    type: 'string',
  })
  key?: string;

  @property({
    type: 'string',
  })
  code?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'date',
  })
  lastTry: Date;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  expiry?: Date;

  constructor(data?: Partial<VerificationCodes>) {
    super(data);
  }
}

export interface VerificationCodesRelations {
  // describe navigational properties here
}

export type VerificationCodesWithRelations = VerificationCodes &
  VerificationCodesRelations;
