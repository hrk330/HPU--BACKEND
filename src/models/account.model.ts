import {Entity, model, property} from '@loopback/repository';

@model()
export class Account extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  accountId: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'number',
    required: true,
  })
  balanceAmount: number;

  @property({
    type: 'number',
    default: 0,
  })
  lastPaymentAmount?: number;
  
  @property({
    type: 'string',
  })
  lastPaymentType?: string;

  @property({
    type: 'date',
  })
  lastPaymentDate?: Date;
  
  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<Account>) {
    super(data);
  }
}

export interface AccountRelations {
  // describe navigational properties here
}

export type BalanceWithRelations = Account & AccountRelations;
