import {Entity, model, property} from '@loopback/repository';

@model()
export class PromoCodes extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  promoId: string;

  @property({
    type: 'string',
    required: true,
  })
  promoCode: string;

  @property({
    type: 'string',
    required: true,
    default: 'R',
  })
  discountType: string;

  @property({
    type: 'string',
    required: true,
  })
  discountValue: string;

  @property({
    type: 'number',
    required: true,
  })
  userLimit: number;

  @property({
    type: 'number',
    required: true,
  })
  totalLimit: number;

  @property({
    type: 'number',
    required: true,
  })
  totalUsed: number;

  @property({
    type: 'string',
    required: true,
  })
  startDate: string;

  @property({
    type: 'string',
    required: true,
  })
  startTime: string;

  @property({
    type: 'string',
    required: true,
  })
  endDate: string;

  @property({
    type: 'string',
    required: true,
  })
  endTime: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isActive: boolean;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;


  constructor(data?: Partial<PromoCodes>) {
    super(data);
  }
}

export interface PromoCodesRelations {
  // describe navigational properties here
}

export type PromoCodesWithRelations = PromoCodes & PromoCodesRelations;
