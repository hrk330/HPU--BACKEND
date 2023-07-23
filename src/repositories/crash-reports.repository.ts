import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {CrashReports, CrashReportsRelations, Witness} from '../models';
import {WitnessRepository} from './witness.repository';

export class CrashReportsRepository extends DefaultCrudRepository<
  CrashReports,
  typeof CrashReports.prototype.crashReportId,
  CrashReportsRelations
> {

  public readonly witnesses: HasManyRepositoryFactory<Witness, typeof CrashReports.prototype.crashReportId>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('WitnessRepository') protected witnessRepositoryGetter: Getter<WitnessRepository>,
  ) {
    super(CrashReports, dataSource);
    this.witnesses = this.createHasManyRepositoryFactoryFor('witnesses', witnessRepositoryGetter,);
    this.registerInclusionResolver('witnesses', this.witnesses.inclusionResolver);
  }
}
