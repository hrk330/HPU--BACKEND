import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Menus, MenusRelations } from '../models';
export declare class MenusRepository extends DefaultCrudRepository<Menus, typeof Menus.prototype.menuId, MenusRelations> {
    constructor(dataSource: MongoDbDataSource);
}
