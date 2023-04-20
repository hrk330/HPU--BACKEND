import {Model, model, property} from '@loopback/repository';
import {getModelSchemaRef} from '@loopback/rest';

@model()
export class CredentialsRequest extends Model {

  @property({
    type: 'string',
    format: 'email',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    minLength: 8,
    required: true,
  })
  password: string;


  constructor(data?: Partial<CredentialsRequest>) {
    super(data);
  }

}

export const CredentialsRequestBody = {
  description: 'The input of login function',
  required: true,
  content: {
    'application/json': {
      schema: getModelSchemaRef(CredentialsRequest, {
        title: 'CredentialsRequestBody',
      }),
    },
  },
};

export interface CredentialsRequestRelations {
  // describe navigational properties here
}

export type CredentialsRequestWithRelations = CredentialsRequest & CredentialsRequestRelations;
