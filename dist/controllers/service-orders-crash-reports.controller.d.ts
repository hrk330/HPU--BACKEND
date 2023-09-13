import { Filter, Where } from '@loopback/repository';
import { ServiceOrders, CrashReports } from '../models';
import { CrashReportsRepository, ServiceOrdersRepository, UserDocsRepository } from '../repositories';
export declare class ServiceOrdersCrashReportsController {
    protected serviceOrdersRepository: ServiceOrdersRepository;
    protected crashReportsRepository: CrashReportsRepository;
    protected userDocsRepository: UserDocsRepository;
    constructor(serviceOrdersRepository: ServiceOrdersRepository, crashReportsRepository: CrashReportsRepository, userDocsRepository: UserDocsRepository);
    get(id: string, filter?: Filter<CrashReports>): Promise<string>;
    create(id: typeof ServiceOrders.prototype.serviceOrderId, crashReports: Omit<CrashReports, 'crashReportId'>): Promise<string>;
    patch(id: string, crashReports: Partial<CrashReports>, where?: Where<CrashReports>): Promise<string>;
}
