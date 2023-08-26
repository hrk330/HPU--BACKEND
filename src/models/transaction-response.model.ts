import {Model, model, property} from '@loopback/repository';

@model({settings: {strict: false}})
export class TransactionResponse extends Model {
  @property({
    type: 'string',
    required: false,
  })
  txndate_processed: string;

  @property({
    type: 'string',
    required: false,
  })
  ccbin: string;

  @property({
    type: 'string',
    required: false,
  })
  timezone: string;

  @property({
    type: 'string',
    required: false,
  })
  processor_network_information: string;

  @property({
    type: 'string',
    required: false,
  })
  oid: string;

  @property({
    type: 'string',
    required: false,
  })
  cccountry: string;

  @property({
    type: 'string',
    required: false,
  })
  expmonth: string;

  @property({
    type: 'string',
    required: false,
  })
  hash_algorithm: string;

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
  processor_response_code: string;

  @property({
    type: 'string',
    required: false,
  })
  chargetotal: string;

  @property({
    type: 'string',
    required: false,
  })
  terminal_id: string;

  @property({
    type: 'string',
    required: false,
  })
  associationResponseCode: string;

  @property({
    type: 'string',
    required: false,
  })
  approval_code: string;

  @property({
    type: 'string',
    required: false,
  })
  expyear: string;

  @property({
    type: 'string',
    required: false,
  })
  response_hash: string;

  @property({
    type: 'string',
    required: false,
  })
  tdate: string;

  @property({
    type: 'string',
    required: false,
  })
  installments_interest: string;

  @property({
    type: 'string',
    required: false,
  })
  bname: string;

  @property({
    type: 'string',
    required: false,
  })
  ccbrand: string;

  @property({
    type: 'string',
    required: false,
  })
  refnumber: string;

  @property({
    type: 'string',
    required: false,
  })
  txntype: string;

  @property({
    type: 'string',
    required: false,
  })
  paymentMethod: string;

  @property({
    type: 'string',
    required: false,
  })
  txndatetime: string;

  @property({
    type: 'string',
    required: false,
  })
  cardnumber: string;

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
    default: '$now',
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

  constructor(data?: Partial<TransactionResponse>) {
    super(data);
  }
}

export interface TransactionResponseRelations {
  // describe navigational properties here
}

export type TransactionResponseWithRelations = TransactionResponse &
  TransactionResponseRelations;
