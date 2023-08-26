import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {DocumentTypes, DocumentTypesRelations} from '../models';

export class DocumentTypesRepository extends DefaultCrudRepository<
  DocumentTypes,
  typeof DocumentTypes.prototype.docTypeId,
  DocumentTypesRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(DocumentTypes, dataSource);
  }
}
