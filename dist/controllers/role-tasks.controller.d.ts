import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { RoleTasks } from '../models';
import { RoleTasksRepository } from '../repositories';
export declare class RoleTasksController {
    roleTasksRepository: RoleTasksRepository;
    constructor(roleTasksRepository: RoleTasksRepository);
    create(roleTasks: Omit<RoleTasks, 'id'>): Promise<RoleTasks>;
    count(where?: Where<RoleTasks>): Promise<Count>;
    find(filter?: Filter<RoleTasks>): Promise<RoleTasks[]>;
    findById(id: string, filter?: FilterExcludingWhere<RoleTasks>): Promise<RoleTasks>;
    updateById(id: string, roleTasks: RoleTasks): Promise<void>;
    replaceById(id: string, roleTasks: RoleTasks): Promise<void>;
    deleteById(id: string): Promise<void>;
}
