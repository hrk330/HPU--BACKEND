import {Entity, model, property} from '@loopback/repository';

@model()
export class BankAccount extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  bankAccountId?: string;
  
  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
    required: true,
  })
  accountHolderName: string;
  
  @property({
    type: 'string',
    required: true,
  })
  accountNumber: string;
  
  @property({
    type: 'string',
    required: true,
  })
	bankName: string;
	
	@property({
    type: 'string',
    required: true,
  })
	accountType: string;
	
	@property({
    type: 'string',
  })
  address?: string;
  
  @property({
    type: 'string',
  })
  zipCode?: string;
  
  @property({
    type: 'string',
  })
  status?: string;
  
  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<BankAccount>) {
    super(data);
  }
}

export interface BankAccountRelations {
  // describe navigational properties here
}

export type BankAccountWithRelations = BankAccount & BankAccountRelations;
