import {Entity, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class Transaction extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  transactionId?: string;

  @property({
    type: 'string',
    required: true,
  })
  serviceOrderId: string;
  
  @property({
    type: 'string',
    required: false,
  })
  transactionProcessedDateTime: string;

  @property({
    type: 'string',
    required: false,
  })
  cardBin: string;

  @property({
    type: 'string',
    required: false,
  })
  timezone: string;

  @property({
    type: 'string',
    required: false,
  })
  processorNetworkInformation: string;

  @property({
    type: 'string',
    required: false,
  })
  oid: string;

  @property({
    type: 'string',
    required: false,
  })
  country: string;

  @property({
    type: 'string',
    required: false,
  })
  expiryMonth: string;

  @property({
    type: 'string',
    required: false,
  })
  hashAlgorithm: string;

  @property({
    type: 'string',
    required: false,
  })
  endpointTransactionId: string;

  @property({
    type: 'string',
    required: false,
  })
  currency: string;

  @property({
    type: 'string',
    required: false,
  })
  processorResponseCode: string;

  @property({
    type: 'string',
    required: false,
  })
  chargeTotal: string;

  @property({
    type: 'string',
    required: false,
  })
  terminalId: string;

  @property({
    type: 'string',
    required: false,
  })
  associationResponseCode: string;

  @property({
    type: 'string',
    required: false,
  })
  approvalCode: string;

  @property({
    type: 'string',
    required: false,
  })
  expiryYear: string;

  @property({
    type: 'string',
    required: false,
  })
  responseHash: string;

  @property({
    type: 'string',
    required: false,
  })
  transactionDateInSeconds: string;

  @property({
    type: 'string',
    required: false,
  })
  installmentsInterest: string;

  @property({
    type: 'string',
    required: false,
  })
  bankName: string;

  @property({
    type: 'string',
    required: false,
  })
  CardBrand: string;

  @property({
    type: 'string',
    required: false,
  })
  referenceNumber: string;

  @property({
    type: 'string',
    required: false,
  })
  transactionType: string;

  @property({
    type: 'string',
    required: false,
  })
  paymentMethod: string;

  @property({
    type: 'string',
    required: false,
  })
  transactionDateTime: string;

  @property({
    type: 'string',
    required: false,
  })
  cardNumber: string;

  @property({
    type: 'string',
    required: false,
  })
  ipgTransactionId: string;

  @property({
    type: 'string',
    required: false,
  })
  status: string;
  
  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}

export interface TransactionRelations {
  // describe navigational properties here
}

export type TransactionWithRelations = Transaction & TransactionRelations;
