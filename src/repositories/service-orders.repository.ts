import {inject, Getter} from '@loopback/core';
import {
  DefaultCrudRepository,
  repository,
  BelongsToAccessor,
  HasManyRepositoryFactory,
  HasOneRepositoryFactory,
} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {
  ServiceOrders,
  ServiceOrdersRelations,
  Services,
  UserDocs,
  CrashReports,
} from '../models';
import {ServicesRepository} from './services.repository';
import {CrashReportsRepository} from './crash-reports.repository';

export class ServiceOrdersRepository extends DefaultCrudRepository<
  ServiceOrders,
  typeof ServiceOrders.prototype.serviceOrderId,
  ServiceOrdersRelations
> {
  public readonly service: BelongsToAccessor<
    Services,
    typeof ServiceOrders.prototype.serviceOrderId
  >;

  public readonly userDocs: HasManyRepositoryFactory<
    UserDocs,
    typeof ServiceOrders.prototype.serviceOrderId
  >;

  public readonly crashReport: HasOneRepositoryFactory<
    CrashReports,
    typeof ServiceOrders.prototype.serviceOrderId
  >;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
    @repository.getter('ServicesRepository')
    protected servicesRepositoryGetter: Getter<ServicesRepository>,
    @repository.getter('CrashReportsRepository')
    protected crashReportsRepositoryGetter: Getter<CrashReportsRepository>,
  ) {
    super(ServiceOrders, dataSource);
    this.crashReport = this.createHasOneRepositoryFactoryFor(
      'crashReport',
      crashReportsRepositoryGetter,
    );
    this.registerInclusionResolver(
      'crashReport',
      this.crashReport.inclusionResolver,
    );
    this.service = this.createBelongsToAccessorFor(
      'service',
      servicesRepositoryGetter,
    );
    this.registerInclusionResolver('service', this.service.inclusionResolver);
  }
}
