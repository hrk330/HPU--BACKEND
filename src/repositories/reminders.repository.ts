import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Reminders, RemindersRelations} from '../models';

export class RemindersRepository extends DefaultCrudRepository<
  Reminders,
  typeof Reminders.prototype.reminderId,
  RemindersRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Reminders, dataSource);
  }
}
