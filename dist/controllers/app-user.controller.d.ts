import { TokenService } from '@loopback/authentication';
import { MyUserService, User } from '@loopback/authentication-jwt';
import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { AppUsers, CredentialsRequest } from '../models';
import { AppUsersRepository, ServiceOrdersRepository, VerificationCodesRepository } from '../repositories';
export declare class AppUserController {
    appUsersRepository: AppUsersRepository;
    jwtService: TokenService;
    userService: MyUserService;
    protected verificationCodesRepository: VerificationCodesRepository;
    serviceOrdersRepository: ServiceOrdersRepository;
    private AccCreateEmails;
    constructor(appUsersRepository: AppUsersRepository, jwtService: TokenService, userService: MyUserService, verificationCodesRepository: VerificationCodesRepository, serviceOrdersRepository: ServiceOrdersRepository);
    whoAmI(currentUserProfile: UserProfile): Promise<string>;
    login(credentials: CredentialsRequest): Promise<String>;
    signUp(newUserRequest: AppUsers): Promise<String>;
    socialSignUp(newUserRequest: AppUsers): Promise<String>;
    socialLogin(newUserRequest: AppUsers): Promise<String>;
    updateProfile(newUserRequest: AppUsers): Promise<String>;
    updateEndpoint(newUserRequest: AppUsers): Promise<String>;
    logoutAppUser(newUserRequest: AppUsers): Promise<String>;
    resetPassword(newUserRequest: AppUsers): Promise<String>;
    changePassword(credentialsRequest: CredentialsRequest): Promise<String>;
    count(where?: Where<AppUsers>): Promise<Count>;
    findByEmail(email: string): Promise<User[]>;
    adminCreateAppUser(newUserRequest: AppUsers): Promise<String>;
    adminUpdateAppUser(newUserRequest: AppUsers): Promise<String>;
    find(filter?: Filter<AppUsers>): Promise<User[]>;
    findById(id: string, filter?: FilterExcludingWhere<AppUsers>): Promise<User>;
    updateById(id: string, appUsers: AppUsers): Promise<void>;
    replaceById(id: string, appUsers: AppUsers): Promise<void>;
    deleteById(id: string): Promise<void>;
}
