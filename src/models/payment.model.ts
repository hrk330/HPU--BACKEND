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
    required: true,
  })
  withdrawalRequestId: string;
  
  @property({
    type: 'string'
  })
  paymentType: string;
  
  @property({
    type: 'string',
  })
  paymentAmount: string;
  
  @property({
    type: 'date',
    default: "$now"
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
