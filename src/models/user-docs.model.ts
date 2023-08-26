import {Entity, model, property} from '@loopback/repository';

@model()
export class UserDocs extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
  })
  docType?: string;

  @property({
    type: 'string',
  })
  docName?: string;

  @property({
    type: 'number',
  })
  docSize?: number;

  @property({
    type: 'string',
  })
  mimetype?: string;

  @property({
    type: 'string',
  })
  docPath?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
    default: 'P',
  })
  docStatus?: string;

  @property({
    type: 'string',
  })
  comments?: string;

  @property({
    type: 'boolean',
  })
  docUpdate?: boolean;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<UserDocs>) {
    super(data);
  }
}

export interface UserDocsRelations {
  // describe navigational properties here
}

export type UserDocsWithRelations = UserDocs & UserDocsRelations;
