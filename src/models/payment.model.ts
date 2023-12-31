import {Entity, model, property} from '@loopback/repository';

@model()
export class Payment extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  paymentId?: string;

  @property({
    type: 'string',
    required: true,
  })
  payerId: string;

  @property({
    type: 'string',
  })
  paymentOrderId: string;

  @property({
    type: 'string',
    required: true,
  })
  receiverId: string;

  @property({
    type: 'string',
  })
  withdrawalRequestId: string;

  @property({
    type: 'string',
  })
  paymentType: string;

  @property({
    type: 'number',
  })
  paymentAmount: number;

  @property({
    type: 'string',
  })
  paymentStatus: string;

  @property({
    type: 'number',
    default: 0,
  })
  platformFee: number;

  @property({
    type: 'number',
    default: 0,
  })
  discountAmount?: number;

  @property({
    type: 'number',
    default: 0,
  })
  taxAmount: number;

  @property({
    type: 'number',
  })
  grossAmount: number;

  @property({
    type: 'number',
  })
  netAmount: number;

  @property({
    type: 'number',
    default: 0,
  })
  serviceFee: number;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<Payment>) {
    super(data);
  }
}

export interface PaymentRelations {
  // describe navigational properties here
}

export type PaymentWithRelations = Payment & PaymentRelations;
