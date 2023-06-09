import {Entity, model, property} from '@loopback/repository';

@model()
export class UserTasks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  userTaskId: string;

  @property({
    type: 'string',
  })
  adminUsersId: string;

  @property({
    type: 'string',
  })
  taskId: string;

  @property({
    type: 'boolean',
  })
  isViewAllowed?: boolean;

  @property({
    type: 'boolean',
  })
  isUpdateAllowed?: boolean;

  @property({
    type: 'boolean',
  })
  isDeleteAllowed?: boolean;

  @property({
    type: 'boolean',
  })
  isCreateAllowed?: boolean;

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

  constructor(data?: Partial<UserTasks>) {
    super(data);
  }
}

export interface UserTasksRelations {
  // describe navigational properties here
}

export type UserTasksWithRelations = UserTasks & UserTasksRelations;
