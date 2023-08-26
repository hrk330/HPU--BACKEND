import {UserCredentials} from '@loopback/authentication-jwt';
import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {UserCreds} from './user-creds.model';
import {Account} from './account.model';
import {BankAccount} from './bank-account.model';
import {ServiceProvider} from './service-provider.model';

@model()
export class Company extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  companyName: string;

  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  phoneNo: string;

  @property({
    type: 'string',
  })
  profilePic?: string;

  @property({
    type: 'string',
  })
  address1?: string;

  @property({
    type: 'string',
  })
  address2?: string;

  @property({
    type: 'string',
  })
  country: string;

  @property({
    type: 'string',
  })
  state?: string;

  @property({
    type: 'string',
  })
  city?: string;

  @property({
    type: 'string',
  })
  zipCode?: string;

  @property({
    type: 'string',
  })
  taxRegistrationNo?: string;

  @property({
    type: 'string',
  })
  status?: string;

  @property({
    type: 'number',
  })
  totalRiders?: number;

  @property({
    type: 'number',
  })
  totalOrders?: number;

  @property({
    type: 'number',
  })
  completionRate?: number;

  @property({
    type: 'number',
  })
  totalEarning?: number;

  @property({
    type: 'number',
  })
  totalRevenue?: number;

  @property({
    type: 'number',
  })
  balance?: number;

  @property({
    type: 'string',
    required: true,
  })
  companyLocation: string;

  @property({
    type: 'string',
    required: true,
  })
  companyLocationCoordinates: string;

  @property({
    type: 'object',
  })
  bankAccountInfo: BankAccount;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  userCredentials: UserCredentials;

  @hasOne(() => UserCreds, {keyTo: 'userId'})
  userCreds: UserCreds;

  @hasOne(() => Account, {keyTo: 'userId'})
  account: Account;

  @hasOne(() => BankAccount, {keyTo: 'userId'})
  bankAccount: BankAccount;

  @hasMany(() => ServiceProvider)
  serviceProviders: ServiceProvider[];

  constructor(data?: Partial<Company>) {
    super(data);
  }
}

export interface CompanyRelations {
  // describe navigational properties here
}

export type CompanyWithRelations = Company & CompanyRelations;
