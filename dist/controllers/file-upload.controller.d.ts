/// <reference types="express" />
import { Request, Response } from '@loopback/rest';
import { AppUsersRepository, CompanyRepository, ServiceProviderRepository, UserDocsRepository } from '../repositories';
import { FileUploadHandler } from '../types';
/**
 * A controller to handle file uploads using multipart/form-data media type
 */
export declare class FileUploadController {
    private handler;
    appUsersRepository: AppUsersRepository;
    companyRepository: CompanyRepository;
    serviceProviderRepository: ServiceProviderRepository;
    userDocsRepository: UserDocsRepository;
    /**
     * Constructor
     * @param handler - Inject an express request handler to deal with the request
     */
    constructor(handler: FileUploadHandler, appUsersRepository: AppUsersRepository, companyRepository: CompanyRepository, serviceProviderRepository: ServiceProviderRepository, userDocsRepository: UserDocsRepository);
    fileUpload(request: Request, response: Response, userId: string): Promise<object>;
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    private saveUploadedFileRecords;
    private insertFilesData;
}
