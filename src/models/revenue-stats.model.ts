import {Model, model, property} from '@loopback/repository';

@model()
export class RevenueStats extends Model {
  @property({
    type: 'number',
  })
  revenue?: number;

  @property({
    type: 'number',
  })
  earning?: number;

  @property({
    type: 'number',
  })
  coffer?: number;

  @property({
    type: 'number',
  })
  outstandingCash?: number;


  constructor(data?: Partial<RevenueStats>) {
    super(data);
  }
}

export interface RevenueStatsRelations {
  // describe navigational properties here
}

export type RevenueStatsWithRelations = RevenueStats & RevenueStatsRelations;
