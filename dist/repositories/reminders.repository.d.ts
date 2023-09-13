import { DefaultCrudRepository } from '@loopback/repository';
import { MongoDbDataSource } from '../datasources';
import { Reminders, RemindersRelations } from '../models';
export declare class RemindersRepository extends DefaultCrudRepository<Reminders, typeof Reminders.prototype.reminderId, RemindersRelations> {
    constructor(dataSource: MongoDbDataSource);
}
