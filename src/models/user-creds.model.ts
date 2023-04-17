import {Entity, model, property} from '@loopback/repository';

@model()
export class UserCreds extends Entity {

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  salt: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<UserCreds>) {
    super(data);
  }
}

export interface UserCredsRelations {
  // describe navigational properties here
}

export type UserCredsWithRelations = UserCreds & UserCredsRelations;
