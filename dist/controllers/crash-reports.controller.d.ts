import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { CrashReports } from '../models';
import { CrashReportsRepository } from '../repositories';
export declare class CrashReportsController {
    crashReportsRepository: CrashReportsRepository;
    constructor(crashReportsRepository: CrashReportsRepository);
    create(crashReports: Omit<CrashReports, 'crashReportId'>): Promise<CrashReports>;
    count(where?: Where<CrashReports>): Promise<Count>;
    find(filter?: Filter<CrashReports>): Promise<CrashReports[]>;
    findById(id: string, filter?: FilterExcludingWhere<CrashReports>): Promise<CrashReports>;
    updateById(id: string, crashReports: CrashReports): Promise<void>;
    replaceById(id: string, crashReports: CrashReports): Promise<void>;
    deleteById(id: string): Promise<void>;
}
