import {Entity, model, property} from '@loopback/repository';

@model()
export class Balance extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  balanceId: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  balanceAmount: string;

  @property({
    type: 'number',
    default: 0,
  })
  lastTransAmount?: number;
  
  @property({
    type: 'number',
    default: 0,
  })
  lastTransType?: number;

  @property({
    type: 'date',
  })
  lastTransDate?: Date;
  
  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<Balance>) {
    super(data);
  }
}

export interface BalanceRelations {
  // describe navigational properties here
}

export type BalanceWithRelations = Balance & BalanceRelations;
