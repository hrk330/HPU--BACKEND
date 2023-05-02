import {Entity, model, property} from '@loopback/repository';

@model()
export class Roles extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  roleId?: string;

  @property({
    type: 'string',
  })
  roleName?: string;

  @property({
    type: 'string',
    default: 'Y',
  })
  isActive?: string;

  @property({
    type: 'date',
    default: "$now"
  })
  createdAt?: Date;

  @property({
    type: 'date',
  })
  updatedAt?: Date;

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
