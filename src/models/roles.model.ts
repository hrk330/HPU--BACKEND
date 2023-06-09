import {Entity, hasMany, model, property} from '@loopback/repository';
import {RoleTasks} from './role-tasks.model';

@model()
export class Roles extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  roleId: string;

  @property({
    type: 'string',
  })
  roleName: string;

  @property({
    type: 'boolean',
    default: true,
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

  @property({
    type: 'any',
  })
  roleTasks: RoleTasks[];

  @hasMany(() => RoleTasks, {keyTo: 'roleId'})
  roleTaskList: RoleTasks[];

  constructor(data?: Partial<Roles>) {
    super(data);
  }
}

export interface RolesRelations {
  // describe navigational properties here
}

export type RolesWithRelations = Roles & RolesRelations;
