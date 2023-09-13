import { Entity } from '@loopback/repository';
export declare class Menus extends Entity {
    menuId: string;
    menuName: string;
    taskId: string;
    parentMenuId: string;
    order: number;
    isViewAllowed?: boolean;
    isUpdateAllowed?: boolean;
    isDeleteAllowed?: boolean;
    isCreateAllowed?: boolean;
    isActive: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    children: Array<Menus>;
    subChildren: Array<Menus>;
    constructor(data?: Partial<Menus>);
}
export interface MenusRelations {
}
export type MenusWithRelations = Menus & MenusRelations;
