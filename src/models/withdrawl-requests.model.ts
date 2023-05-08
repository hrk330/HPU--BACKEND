import {Entity, model, property} from '@loopback/repository';

@model()
export class WithdrawlRequests extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  withdrawlRequestId?: string;

  @property({
    type: 'string',
  })
  serviceProviderId?: string;

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
    default: "L"
  })
  status?: string;

  @property({
    type: 'string',
    default: "L"
  })
  bankName?: string;

  @property({
    type: 'string',
    default: "L"
  })
  accountNumber?: string;

  @property({
    type: 'string',
    default: "L"
  })
  accountHolderName?: string;

  @property({
    type: 'string',
    default: "L"
  })
  swiftCode?: string;

  @property({
    type: 'number',
    default: "L"
  })
  amount?: number;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<WithdrawlRequests>) {
    super(data);
  }
}

export interface WithdrawlRequestsRelations {
  // describe navigational properties here
}

export type WithdrawlRequestsWithRelations = WithdrawlRequests & WithdrawlRequestsRelations;
