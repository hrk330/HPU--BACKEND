import {UserCredentials} from '@loopback/authentication-jwt';
import {Entity, model, property, hasOne, hasMany} from '@loopback/repository';
import {UserTasks} from './user-tasks.model';
import {UserCreds} from './user-creds.model';

@model()
export class AdminUsers extends Entity {
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
    type: 'string',
  })
  isBlocked?: string;

  @property({
    type: 'string',
  })
  status?: string;

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
    type: 'number',
  })
  wrongTries?: number;

  @property({
    type: 'date',
  })
  lastSuccessfulLogin?: Date;

  @property({
    type: 'date',
  })
  lastUnsuccessfulLogin?: Date;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  userCredentials: UserCredentials;

  @property({
    type: 'any',
  })
  userTasksList: UserTasks[];

  @hasMany(() => UserTasks, {keyTo: 'adminUsersId'})
  userTasks: UserTasks[];

  @hasOne(() => UserCreds, {keyTo: 'userId'})
  userCreds: UserCreds;

  constructor(data?: Partial<AdminUsers>) {
    super(data);
  }
}

export interface AdminUsersRelations {
  // describe navigational properties here
}

export type AdminUsersWithRelations = AdminUsers & AdminUsersRelations;
