import { Count, Filter, Where } from '@loopback/repository';
import { Roles, RoleTasks } from '../models';
import { RolesRepository } from '../repositories';
export declare class RolesRoleTasksController {
    protected rolesRepository: RolesRepository;
    constructor(rolesRepository: RolesRepository);
    find(id: string, filter?: Filter<RoleTasks>): Promise<RoleTasks[]>;
    create(id: typeof Roles.prototype.roleId, roleTasks: Omit<RoleTasks, 'roleTaskId'>): Promise<RoleTasks>;
    patch(id: string, roleTasks: Partial<RoleTasks>, where?: Where<RoleTasks>): Promise<Count>;
    delete(id: string, where?: Where<RoleTasks>): Promise<Count>;
}
