import { Count, FilterExcludingWhere, Where } from '@loopback/repository';
import { Menus, RoleTasks } from '../models';
import { AdminUsersRepository, MenusRepository, RolesRepository } from '../repositories';
export declare class MenusController {
    menusRepository: MenusRepository;
    adminUsersRepository: AdminUsersRepository;
    rolesRepository: RolesRepository;
    constructor(menusRepository: MenusRepository, adminUsersRepository: AdminUsersRepository, rolesRepository: RolesRepository);
    create(menus: Omit<Menus, 'menuId'>): Promise<Menus>;
    count(where?: Where<Menus>): Promise<Count>;
    find(): Promise<Menus[]>;
    getSidebarMenus(userId: string): Promise<Menus[]>;
    filterMenuForUserRole(dbMenusList: Menus[], dbRoletasks: RoleTasks[]): Promise<void>;
    getParentChildMenuStructure(dbMenusList: Menus[], parentChildMenuStructure: Menus[]): Promise<void>;
    findById(id: string, filter?: FilterExcludingWhere<Menus>): Promise<Menus>;
    updateById(id: string, menus: Menus): Promise<void>;
    replaceById(id: string, menus: Menus): Promise<void>;
    deleteById(id: string): Promise<void>;
}
