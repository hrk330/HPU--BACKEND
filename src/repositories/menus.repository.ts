import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Menus, MenusRelations} from '../models';

export class MenusRepository extends DefaultCrudRepository<
  Menus,
  typeof Menus.prototype.menuId,
  MenusRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Menus, dataSource);
  }
}
