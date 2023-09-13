import { TokenService } from '@loopback/authentication';
import { MyUserService } from '@loopback/authentication-jwt';
import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { AdminUsers, CredentialsRequest, UserTasks } from '../models';
import { AdminUsersRepository, RolesRepository, TasksRepository } from '../repositories';
export declare class AdminUsersController {
    adminUsersRepository: AdminUsersRepository;
    tasksRepository: TasksRepository;
    jwtService: TokenService;
    userService: MyUserService;
    rolesRepository: RolesRepository;
    constructor(adminUsersRepository: AdminUsersRepository, tasksRepository: TasksRepository, jwtService: TokenService, userService: MyUserService, rolesRepository: RolesRepository);
    login(credentials: CredentialsRequest): Promise<String>;
    create(adminUsers: Omit<AdminUsers, 'id'>): Promise<Object>;
    checkIfValidRole(roleId: string): Promise<boolean>;
    checkAdminUserExists(email: string): Promise<boolean>;
    addUserTasks(userTasks: UserTasks[], adminUsersId: string): Promise<UserTasks[]>;
    checkTasks(userTasks: UserTasks[], adminUsersId: string): Promise<UserTasks[]>;
    updateUserTasks(userTasks: UserTasks[], adminUsersId: string): Promise<void>;
    updateAdminUser(adminUsers: AdminUsers): Promise<Object>;
    count(where?: Where<AdminUsers>): Promise<Count>;
    find(filter?: Filter<AdminUsers>): Promise<AdminUsers[]>;
    findById(id: string, filter?: FilterExcludingWhere<AdminUsers>): Promise<AdminUsers>;
    updateById(id: string, adminUsers: AdminUsers): Promise<void>;
    replaceById(id: string, adminUsers: AdminUsers): Promise<void>;
}
