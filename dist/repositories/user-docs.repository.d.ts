import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { UserDocs, UserDocsRelations } from '../models';
export declare class UserDocsRepository extends DefaultCrudRepository<UserDocs, typeof UserDocs.prototype.id, UserDocsRelations> {
    constructor(dataSource: MongoDbDataSource);
}
