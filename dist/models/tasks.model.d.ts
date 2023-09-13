import { Entity } from '@loopback/repository';
export declare class Tasks extends Entity {
    taskId: string;
    taskType?: string;
    taskName?: string;
    isViewAllowed?: boolean;
    isUpdateAllowed?: boolean;
    isDeleteAllowed?: boolean;
    isCreateAllowed?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<Tasks>);
}
export interface TasksRelations {
}
export type TasksWithRelations = Tasks & TasksRelations;
