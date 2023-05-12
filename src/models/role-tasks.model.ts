import {Entity, model, property} from '@loopback/repository';

@model()
export class RoleTasks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  roleTaskId: string;

  @property({
    type: 'string',
  })
  roleId: string;

  @property({
    type: 'string',
  })
  taskId: string;

  @property({
    type: 'string',
  })
  isViewAllowed?: string;

  @property({
    type: 'string',
  })
  isUpdateAllowed?: string;

  @property({
    type: 'string',
  })
  isDeleteAllowed?: string;

  @property({
    type: 'string',
  })
  isCreateAllowed?: string;

  @property({
    type: 'string',
    default: 'N',
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


  constructor(data?: Partial<RoleTasks>) {
    super(data);
  }
}

export interface RoleTasksRelations {
  // describe navigational properties here
}

export type RoleTasksWithRelations = RoleTasks & RoleTasksRelations;
