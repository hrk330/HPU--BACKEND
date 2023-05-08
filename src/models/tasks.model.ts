import {Entity, model, property} from '@loopback/repository';

@model()
export class Tasks extends Entity {

  @property({
    type: 'string',
    id: true,
  })
  taskId?: string;

  @property({
    type: 'string',
  })
  taskType?: string;

  @property({
    type: 'string',
  })
  taskName?: string;

  @property({
    type: 'string',
  })
  isAllowed?: string;

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

  constructor(data?: Partial<Tasks>) {
    super(data);
  }
}

export interface TasksRelations {
  // describe navigational properties here
}

export type TasksWithRelations = Tasks & TasksRelations;
