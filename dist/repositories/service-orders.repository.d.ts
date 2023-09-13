import { Getter } from '@loopback/core';
import { DefaultCrudRepository, BelongsToAccessor, HasManyRepositoryFactory, HasOneRepositoryFactory } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { ServiceOrders, ServiceOrdersRelations, Services, UserDocs, CrashReports } from '../models';
import { ServicesRepository } from './services.repository';
import { CrashReportsRepository } from './crash-reports.repository';
export declare class ServiceOrdersRepository extends DefaultCrudRepository<ServiceOrders, typeof ServiceOrders.prototype.serviceOrderId, ServiceOrdersRelations> {
    protected servicesRepositoryGetter: Getter<ServicesRepository>;
    protected crashReportsRepositoryGetter: Getter<CrashReportsRepository>;
    readonly service: BelongsToAccessor<Services, typeof ServiceOrders.prototype.serviceOrderId>;
    readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof ServiceOrders.prototype.serviceOrderId>;
    readonly crashReport: HasOneRepositoryFactory<CrashReports, typeof ServiceOrders.prototype.serviceOrderId>;
    constructor(dataSource: MongoDbDataSource, servicesRepositoryGetter: Getter<ServicesRepository>, crashReportsRepositoryGetter: Getter<CrashReportsRepository>);
}
