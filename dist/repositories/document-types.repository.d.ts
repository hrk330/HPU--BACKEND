import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { DocumentTypes, DocumentTypesRelations } from '../models';
export declare class DocumentTypesRepository extends DefaultCrudRepository<DocumentTypes, typeof DocumentTypes.prototype.docTypeId, DocumentTypesRelations> {
    constructor(dataSource: MongoDbDataSource);
}
