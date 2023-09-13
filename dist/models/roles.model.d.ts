import { Entity } from '@loopback/repository';
import { RoleTasks } from './role-tasks.model';
export declare class Roles extends Entity {
    roleId: string;
    roleName: string;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    roleTasks: RoleTasks[];
    roleTaskList: RoleTasks[];
    constructor(data?: Partial<Roles>);
}
export interface RolesRelations {
}
export type RolesWithRelations = Roles & RolesRelations;
