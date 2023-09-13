import { CodeVerificationResponse } from '../interfaces';
import { AppUsers, ServiceProvider, VerificationRequestObject } from '../models';
import { AppUsersRepository, ServiceProviderRepository, VerificationCodesRepository } from '../repositories';
export declare class CodeVerificationController {
    protected verificationCodesRepository: VerificationCodesRepository;
    appUsersRepository: AppUsersRepository;
    serviceProviderRepository: ServiceProviderRepository;
    private AccCreateEmails;
    constructor(verificationCodesRepository: VerificationCodesRepository, appUsersRepository: AppUsersRepository, serviceProviderRepository: ServiceProviderRepository);
    verifyCodeForAppUser(verificationRequestObject: VerificationRequestObject): Promise<String>;
    verifyCodeForServiceProvider(verificationRequestObject: VerificationRequestObject): Promise<String>;
    verifyVerificationCode(verificationRequestObject: VerificationRequestObject): Promise<CodeVerificationResponse>;
    updatePhoneNumber(verificationRequestObject: VerificationRequestObject): Promise<String>;
    verifyPhoneNumber(newUserRequest: AppUsers): Promise<String>;
    verifyEmailAddress(newUserRequest: AppUsers): Promise<String>;
    updateEmailAddress(newUserRequest: AppUsers): Promise<String>;
    sendEmailCodeForAppUser(verificationRequestObject: VerificationRequestObject): Promise<String>;
    sendEmailCodeForServiceProvider(verificationRequestObject: VerificationRequestObject): Promise<String>;
    insertVerificationCode(user: AppUsers | ServiceProvider | null, verificationRequestObject: VerificationRequestObject, codeType: string): Promise<CodeVerificationResponse>;
    sendSmsCode(verificationRequestObject: VerificationRequestObject): Promise<String>;
    getRandomInt(max: number): Promise<string>;
    addMinutes(date: Date, minutes: number): Promise<Date>;
}
