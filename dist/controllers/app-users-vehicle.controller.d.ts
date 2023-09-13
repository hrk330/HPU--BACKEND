import { Count, Filter, Where } from '@loopback/repository';
import { AppUsers, Vehicle } from '../models';
import { AppUsersRepository } from '../repositories';
export declare class AppUsersVehicleController {
    protected appUsersRepository: AppUsersRepository;
    constructor(appUsersRepository: AppUsersRepository);
    find(id: string, filter?: Filter<Vehicle>): Promise<Vehicle[]>;
    create(id: typeof AppUsers.prototype.id, vehicle: Omit<Vehicle, 'vehicleId'>): Promise<Vehicle>;
    patch(id: string, vehicle: Partial<Vehicle>, where?: Where<Vehicle>): Promise<Count>;
    delete(id: string, where?: Where<Vehicle>): Promise<Count>;
}
