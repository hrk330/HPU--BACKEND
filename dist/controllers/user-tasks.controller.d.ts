import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { UserTasks } from '../models';
import { UserTasksRepository } from '../repositories';
export declare class UserTasksController {
    userTasksRepository: UserTasksRepository;
    constructor(userTasksRepository: UserTasksRepository);
    create(userTasks: Omit<UserTasks, 'userTaskId'>): Promise<UserTasks>;
    count(where?: Where<UserTasks>): Promise<Count>;
    find(filter?: Filter<UserTasks>): Promise<UserTasks[]>;
    findById(id: string, filter?: FilterExcludingWhere<UserTasks>): Promise<UserTasks>;
    updateById(id: string, userTasks: UserTasks): Promise<void>;
    replaceById(id: string, userTasks: UserTasks): Promise<void>;
    deleteById(id: string): Promise<void>;
}
