import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Tasks } from '../models';
import { TasksRepository } from '../repositories';
export declare class TasksController {
    tasksRepository: TasksRepository;
    constructor(tasksRepository: TasksRepository);
    create(tasks: Tasks): Promise<Tasks>;
    count(where?: Where<Tasks>): Promise<Count>;
    find(filter?: Filter<Tasks>): Promise<Tasks[]>;
    findById(id: string, filter?: FilterExcludingWhere<Tasks>): Promise<Tasks>;
    updateById(id: string, tasks: Tasks): Promise<void>;
    replaceById(id: string, tasks: Tasks): Promise<void>;
    deleteById(id: string): Promise<void>;
}
