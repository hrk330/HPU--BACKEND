import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Roles, RoleTasks } from '../models';
import { RolesRepository, TasksRepository } from '../repositories';
export declare class RolesController {
    rolesRepository: RolesRepository;
    tasksRepository: TasksRepository;
    constructor(rolesRepository: RolesRepository, tasksRepository: TasksRepository);
    create(roles: Roles): Promise<Object>;
    checkRoleExists(roleId: string, roleName: string): Promise<boolean>;
    addRole(roles: Roles): Promise<Roles>;
    addRoleTasks(roleTasks: RoleTasks[], roleId: string): Promise<RoleTasks[]>;
    updateRoleTasks(roleTasks: RoleTasks[], roleId: string): Promise<void>;
    checkTasks(roleTasks: RoleTasks[]): Promise<RoleTasks[]>;
    count(where?: Where<Roles>): Promise<Count>;
    find(filter?: Filter<Roles>): Promise<Roles[]>;
    findById(id: string, filter?: FilterExcludingWhere<Roles>): Promise<Roles>;
    updateById(roles: Roles): Promise<Object>;
    replaceById(id: string, roles: Roles): Promise<void>;
    deleteById(id: string): Promise<void>;
}
