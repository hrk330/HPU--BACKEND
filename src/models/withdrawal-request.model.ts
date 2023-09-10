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
  serviceProviderId: string;

  @property({
    type: 'string',
  })
  serviceProviderUsername?: string;

  @property({
    type: 'string',
  })
  serviceProviderName?: string;

  @property({
    type: 'string',
    default: 'L',
  })
  status?: string;

  @property({
    type: 'string',
  })
  comments?: string;

  @property({
    type: 'string',
  })
  bankName?: string;

  @property({
    type: 'string',
  })
  accountNumber?: string;

  @property({
    type: 'string',
  })
  accountHolderName?: string;

  @property({
    type: 'string',
  })
  swiftCode?: string;

  @property({
    type: 'number',
  })
  withdrawalAmount: number;

  @property({
    type: 'number',
  })
  unpaidAmount: number;

  @property({
    type: 'string',
  })
  rejectionReason?: string;

  @property({
    type: 'string',
  })
  profilePic: string;

  @property({
    type: 'string',
    default: 'S',
  })
  createdBy?: string;

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
  userAccountId?: string;

  constructor(data?: Partial<WithdrawalRequest>) {
    super(data);
  }
}

export interface WithdrawalRequestRelations {
  // describe navigational properties here
}

export type WithdrawalRequestsWithRelations = WithdrawalRequest &
  WithdrawalRequestRelations;
