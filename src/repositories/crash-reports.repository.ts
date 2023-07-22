import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {CrashReports, CrashReportsRelations} from '../models';

export class CrashReportsRepository extends DefaultCrudRepository<
  CrashReports,
  typeof CrashReports.prototype.crashReportId,
  CrashReportsRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(CrashReports, dataSource);
  }
}
