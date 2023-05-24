import {Entity, model, property} from '@loopback/repository';

@model()
export class Menus extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  menuId: string;

  @property({
    type: 'string',
  })
  menuName: string;

  @property({
    type: 'string',
  })
  taskId: string;

  @property({
    type: 'string',
  })
  parentMenuId: string;

  @property({
    type: 'number',
  })
  order: number;

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
    type: 'string',
  })
  isActive: string;

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
  children: Array<Menus>;

  @property({
    type: 'any',
  })
  subChildren: Array<Menus>;

  constructor(data?: Partial<Menus>) {
    super(data);
  }
}

export interface MenusRelations {
  // describe navigational properties here
}

export type MenusWithRelations = Menus & MenusRelations;
