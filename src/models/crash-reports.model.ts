import {Entity, model, property} from '@loopback/repository';

@model()
export class CrashReports extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  crashReportId?: string;

  @property({
    type: 'string',
    required: true,
  })
  ownerName: string;
  
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  vehicleId?: string;
  
  @property({
    type: 'string',
    required: true,
  })
  vehicleType: string;

	@property({
    type: 'string',
  })
  plateNumber?: string;

  @property({
    type: 'string',
    required: true,
  })
  userId: string;

  @property({
    type: 'string',
  })
  location?: string;

  @property({
    type: 'string',
  })
  damageDescription?: string;

  @property({
    type: 'string',
  })
  incidentDescription?: string;

  @property({
    type: 'string',
  })
  ownerStatement?: string;

	@property({
    type: 'string',
  })
  otherDriverName?: string;
  
  @property({
    type: 'string',
  })
  otherVehiclePlateNumber?: string;
  
  @property({
    type: 'string',
  })
  otherVehicleMake?: string;
  
  @property({
    type: 'string',
  })
  otherVehicleInsuranceCompany?: string;
  
  @property({
    type: 'string',
  })
  otherDamageDescription?: string;
  
  @property({
    type: 'string',
  })
  otherStatement?: string;

	@property({
    type: 'string',
  })
  witnessName?: string;
  
  @property({
    type: 'string',
  })
  witnessStatement?: string;
  
  @property({
    type: 'string',
  })
  assessorName?: string;

	@property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<CrashReports>) {
    super(data);
  }
}

export interface CrashReportsRelations {
  // describe navigational properties here
}

export type CrashReportsWithRelations = CrashReports & CrashReportsRelations;
