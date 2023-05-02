import {UserCredentials} from '@loopback/authentication-jwt';
import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import {UserCreds} from './user-creds.model';
import {Vehicle} from './vehicle.model';
import {UserDocs} from './user-docs.model';

@model()
export class AppUsers extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  username?: string;

  @property({
    type: 'string',
  })
  email: string;

  @property({
    type: 'boolean',
  })
  emailVerified: boolean;

  @property({
    type: 'string',
  })
  password: string;

  @property({
    type: 'string',
  })
  userType: string;

  @property({
    type: 'string',
  })
  firstName: string;

  @property({
    type: 'string',
  })
  lastName: string;

  @property({
    type: 'string',
  })
  dateOfBirth?: string;

  @property({
    type: 'string',
  })
  identityNo?: string;

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
  phoneNo?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'string',
  })
  isBlocked?: string;

  @property({
    type: 'string',
  })
  roleId?: string;

  @property({
    type: 'date',
  })
  passwordUpdatedAt?: string;

  @property({
    type: 'string',
    default: 'N'
  })
  isMobileVerified?: string;

  @property({
    type: 'string',
    default: 'N'
  })
  isProfileCompleted?: string;

  @property({
    type: 'string',
  })
  isServiceProviderVerified?: string;

  @property({
    type: 'string',
  })
  serviceProviderType?: string;

  @property({
    type: 'string'
  })
  socialId?: string;

  @property({
    type: 'string'
  })
  socialIdType?: string;

  userCredentials: UserCredentials;

  @hasMany(() => Vehicle, {keyTo: 'userId'})
  vehicles: Vehicle[];

  @hasOne(() => UserCreds, {keyTo: 'userId'})
  userCreds: UserCreds;

  @hasMany(() => UserDocs, {keyTo: 'userId'})
  userDocs: UserDocs[];

  constructor(data?: Partial<AppUsers>) {
    super(data);
  }
}

export interface AppUsersRelations {
  // describe navigational properties here
}

export type AppUsersWithRelations = AppUsers & AppUsersRelations;
