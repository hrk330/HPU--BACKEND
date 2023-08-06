import {Entity, model, property, belongsTo, hasOne} from '@loopback/repository';
import { AppUsers } from './app-users.model';
import {Services} from './services.model';
import {CrashReports} from './crash-reports.model';
import { UserDocs } from './user-docs.model';

@model()
export class ServiceOrders extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  serviceOrderId: string;

  @property({
    type: 'string',
  })
  serviceProviderId: string;

  @property({
    type: 'string',
  })
  serviceProviderUsername?: string;

  @property({
    type: 'string',
  })
  userId: string;
  
  @property({
    type: 'string',
  })
  userName: string;

  @property({
    type: 'string',
  })
  serviceProviderName?: string;
  
  @property({
    type: 'string',
  })
  serviceName?: string;

  @property({
    type: 'string',
  })
  serviceType?: string;

  @property({
    type: 'string',
  })
  vehicleType?: string;
  
  @property({
    type: 'string',
  })
  vehicleId?: string;
  
  @property({
    type: 'string',
  })
  orderType?: string;

  @property({
    type: 'string',
  })
  companyId?: string;
  
  @property({
    type: 'string',
  })
  companyName?: string;

  @property({
    type: 'string',
  })
  pickupLocation?: string;

  @property({
    type: 'string',
  })
  pickupLocationCoordinates?: string;

  @property({
    type: 'string',
  })
  dropLocation?: string;

  @property({
    type: 'string',
  })
  dropLocationCoordinates?: string;

  @property({
    type: 'number',
  })
  distance: number;

  @property({
    type: 'number',
  })
  extraDistance?: number;

  @property({
    type: 'string',
  })
  instructions?: string;

  @property({
    type: 'string',
  })
  promoId: string;

  @property({
    type: 'string',
  })
  promoCode?: string;

	@property({
    type: 'number',
  })
  discountAmount?: number;
  
  @property({
    type: 'number',
  })
  discountValue?: number;

  @property({
    type: 'string',
  })
  discountType?: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'number',
  })
  taxPercentage: number;

  @property({
    type: 'number',
  })
  taxAmount: number;

  @property({
    type: 'number',
  })
  grossAmount: number;

  @property({
    type: 'number',
  })
  netAmount: number;
  
  @property({
    type: 'number',
  })
  serviceFee: number;
  
  @property({
    type: 'boolean',
  })
  serviceFeePaid: boolean;
  
  @property({
    type: 'number',
  })
  distanceAmount: number;

  @property({
    type: 'string',
  })
  paymentMethod?: string;

  @property({
    type: 'number',
  })
  rating: number;
  
  @property({
    type: 'boolean',
  })
  accidental?: boolean;
  
  @property({
    type: 'date',
  })
  confirmedAt?: Date;

	@property({
    type: 'date',
  })
  scheduledAt?: Date;
  
  @property({
    type: 'date',
  })
  expectedAt?: Date;
  
  @property({
    type: 'date',
  })
  acceptedAt?: Date;

  @property({
    type: 'date',
  })
  arrivedAt?: Date;

  @property({
    type: 'date',
  })
  startedAt?: Date;

  @property({
    type: 'date',
  })
  completedAt?: Date;
  
  @property({
    type: 'any',
  })
  serviceProvider: AppUsers;
  
  @property({
    type: 'array',
    itemType: 'string',
  })
  proofOfWorkDocIds: string[];
  
  @property({
    type: 'array',
    itemType: 'object',
  })
  proofOfWorkDocs: UserDocs[];
  
  @property({
    type: 'string',
  })
  additionalNote?: string;
  
  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @belongsTo(() => Services)
  serviceId: string;

  @hasOne(() => CrashReports, {keyTo: 'serviceOrderId'})
  crashReport: CrashReports;

  constructor(data?: Partial<ServiceOrders>) {
    super(data);
  }
}

export interface ServiceOrdersRelations {
  // describe navigational properties here
}

export type ServiceOrdersWithRelations = ServiceOrders & ServiceOrdersRelations;
