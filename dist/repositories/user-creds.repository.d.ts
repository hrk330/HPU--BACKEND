import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { UserCreds, UserCredsRelations } from '../models';
export declare class UserCredsRepository extends DefaultCrudRepository<UserCreds, typeof UserCreds.prototype.id, UserCredsRelations> {
    constructor(dataSource: MongoDbDataSource);
}
