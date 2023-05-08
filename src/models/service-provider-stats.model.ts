import {Model, model, property} from '@loopback/repository';

@model()
export class ServiceProviderStats extends Model {
  @property({
    type: 'number',
  })
  totalServiceProviders?: number;

  @property({
    type: 'number',
  })
  approvedServiceProviders?: number;

  @property({
    type: 'number',
  })
  rejectedServiceProviders?: number;

  @property({
    type: 'string',
  })
  serviceProviderId?: string;

  @property({
    type: 'string',
  })
  serviceProviderName?: string;

  @property({
    type: 'number',
  })
  amount?: number;

  @property({
    type: 'number',
  })
  status?: number;

  @property({
    type: 'date',
  })
  joinedDateTime?: Date;

  constructor(data?: Partial<ServiceProviderStats>) {
    super(data);
  }
}

export interface ServiceProviderStatsRelations {
  // describe navigational properties here
}

export type ServiceProviderStatsWithRelations = ServiceProviderStats & ServiceProviderStatsRelations;
