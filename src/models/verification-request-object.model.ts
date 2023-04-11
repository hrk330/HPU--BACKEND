import {Model, model, property} from '@loopback/repository';

@model()
export class VerificationRequestObject extends Model {
  @property({
    type: 'string',
  })
  email?: string;

  @property({
    type: 'string',
  })
  userId?: string;

  @property({
    type: 'string',
  })
  verificationCode?: string;

  @property({
    type: 'string',
  })
  phoneNo?: string;


  constructor(data?: Partial<VerificationRequestObject>) {
    super(data);
  }
}

export interface VerificationRequestObjectRelations {
  // describe navigational properties here
}

export type VerificationRequestObjectWithRelations = VerificationRequestObject & VerificationRequestObjectRelations;
