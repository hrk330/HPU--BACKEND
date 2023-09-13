import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { CrashReports, CrashReportsRelations, Witness } from '../models';
import { WitnessRepository } from './witness.repository';
export declare class CrashReportsRepository extends DefaultCrudRepository<CrashReports, typeof CrashReports.prototype.crashReportId, CrashReportsRelations> {
    protected witnessRepositoryGetter: Getter<WitnessRepository>;
    readonly witnesses: HasManyRepositoryFactory<Witness, typeof CrashReports.prototype.crashReportId>;
    constructor(dataSource: MongoDbDataSource, witnessRepositoryGetter: Getter<WitnessRepository>);
}
