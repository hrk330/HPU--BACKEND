import { Count, Filter, Where } from '@loopback/repository';
import { CrashReports, Witness } from '../models';
import { CrashReportsRepository } from '../repositories';
export declare class CrashReportsWitnessController {
    protected crashReportsRepository: CrashReportsRepository;
    constructor(crashReportsRepository: CrashReportsRepository);
    find(id: string, filter?: Filter<Witness>): Promise<Witness[]>;
    create(id: typeof CrashReports.prototype.crashReportId, witness: Omit<Witness, 'witnessId'>): Promise<Witness>;
    patch(id: string, witness: Partial<Witness>, where?: Where<Witness>): Promise<Count>;
    delete(id: string, where?: Where<Witness>): Promise<Count>;
}
