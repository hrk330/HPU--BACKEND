import {Entity, model, property} from '@loopback/repository';

@model()
export class DocumentTypes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  docTypeId?: string;

  @property({
    type: 'string',
    required: true,
  })
  docType: string;
  
  @property({
    type: 'boolean',
    default: true
  })
  isActive?: boolean;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<DocumentTypes>) {
    super(data);
  }
}

export interface DocumentTypesRelations {
  // describe navigational properties here
}

export type DocumentTypesWithRelations = DocumentTypes & DocumentTypesRelations;
