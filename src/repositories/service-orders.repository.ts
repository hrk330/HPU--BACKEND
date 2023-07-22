import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor, HasManyRepositoryFactory} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {ServiceOrders, ServiceOrdersRelations, Services, UserDocs} from '../models';
import {ServicesRepository} from './services.repository';

export class ServiceOrdersRepository extends DefaultCrudRepository<
  ServiceOrders,
  typeof ServiceOrders.prototype.serviceOrderId,
  ServiceOrdersRelations
> {

  public readonly service: BelongsToAccessor<Services, typeof ServiceOrders.prototype.serviceOrderId>;

  public readonly userDocs: HasManyRepositoryFactory<UserDocs, typeof ServiceOrders.prototype.serviceOrderId>;

  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource, @repository.getter('ServicesRepository') protected servicesRepositoryGetter: Getter<ServicesRepository>,
  ) {
    super(ServiceOrders, dataSource);
    this.registerInclusionResolver('userDocs', this.userDocs.inclusionResolver);
    this.service = this.createBelongsToAccessorFor('service', servicesRepositoryGetter,);
    this.registerInclusionResolver('service', this.service.inclusionResolver);
  }
}
