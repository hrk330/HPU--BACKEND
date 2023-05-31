import {Entity, model, property} from '@loopback/repository';

@model()
export class WithdrawalRequest extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  withdrawalRequestId: string;

  @property({
    type: 'string',
  })
  requesterId: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'string',
  })
  requestDate?: string;

  @property({
    type: 'string',
  })
  requestTime?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<WithdrawalRequest>) {
    super(data);
  }
}

export interface WithdrawalRequestRelations {
  // describe navigational properties here
}

export type WithdrawalRequestWithRelations = WithdrawalRequest & WithdrawalRequestRelations;
