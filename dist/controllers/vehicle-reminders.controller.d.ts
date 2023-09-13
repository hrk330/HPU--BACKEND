import { Filter, Where } from '@loopback/repository';
import { Vehicle, Reminders } from '../models';
import { VehicleRepository } from '../repositories';
export declare class VehicleRemindersController {
    protected vehicleRepository: VehicleRepository;
    constructor(vehicleRepository: VehicleRepository);
    find(id: string, filter?: Filter<Reminders>): Promise<string>;
    create(id: typeof Vehicle.prototype.vehicleId, reminders: Omit<Reminders, 'reminderId'>): Promise<string>;
    patch(id: string, reminders: Partial<Reminders>, where?: Where<Reminders>): Promise<string>;
    delete(id: string, where?: Where<Reminders>): Promise<string>;
}
