import { Entity } from '@loopback/repository';
export declare class UserTasks extends Entity {
    userTaskId: string;
    adminUsersId: string;
    taskId: string;
    isViewAllowed?: boolean;
    isUpdateAllowed?: boolean;
    isDeleteAllowed?: boolean;
    isCreateAllowed?: boolean;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<UserTasks>);
}
export interface UserTasksRelations {
}
export type UserTasksWithRelations = UserTasks & UserTasksRelations;
