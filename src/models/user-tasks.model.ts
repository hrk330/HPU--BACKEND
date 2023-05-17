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

  constructor(data?: Partial<UserTasks>) {
    super(data);
  }
}

export interface UserTasksRelations {
  // describe navigational properties here
}

export type UserTasksWithRelations = UserTasks & UserTasksRelations;
