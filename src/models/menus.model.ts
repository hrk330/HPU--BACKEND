import {Entity, model, property} from '@loopback/repository';

@model()
export class Menus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  menuId?: string;

  @property({
    type: 'string',
  })
  menuName?: string;

  @property({
    type: 'string',
  })
  taskId?: string;

  @property({
    type: 'string',
  })
  parentMenuId?: string;

  @property({
    type: 'string',
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

  constructor(data?: Partial<Menus>) {
    super(data);
  }
}

export interface MenusRelations {
  // describe navigational properties here
}

export type MenusWithRelations = Menus & MenusRelations;
