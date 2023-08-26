import {Entity, model, property, hasMany} from '@loopback/repository';
import {UserDocs} from './user-docs.model';
import {Witness} from './witness.model';

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
  serviceProviderId: string;

  @property({
    type: 'string',
  })
  adminUserId: string;

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
    type: 'string',
  })
  serviceOrderId?: string;

  @property({
    type: 'string',
  })
  status: string;

  @property({
    type: 'date',
    default: '$now',
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  @property({
    type: 'array',
    itemType: 'string',
  })
  crashReportDocIds: string[];

  @property({
    type: 'array',
    itemType: 'string',
  })
  otherPartyDocIds: string[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  crashReportDocs: UserDocs[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  witnessList: Witness[];

  @property({
    type: 'array',
    itemType: 'object',
  })
  otherPartyDocs: UserDocs[];

  @hasMany(() => Witness, {keyTo: 'crashReportId'})
  witnesses: Witness[];

  constructor(data?: Partial<CrashReports>) {
    super(data);
  }
}

export interface CrashReportsRelations {
  // describe navigational properties here
}

export type CrashReportsWithRelations = CrashReports & CrashReportsRelations;
