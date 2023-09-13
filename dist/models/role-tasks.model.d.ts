import { Entity } from '@loopback/repository';
export declare class RoleTasks extends Entity {
    roleTaskId: string;
    roleId: string;
    taskId: string;
    isViewAllowed?: boolean;
    isUpdateAllowed?: boolean;
    isDeleteAllowed?: boolean;
    isCreateAllowed?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<RoleTasks>);
}
export interface RoleTasksRelations {
}
export type RoleTasksWithRelations = RoleTasks & RoleTasksRelations;
