import { Filter, FilterExcludingWhere } from '@loopback/repository';
import { Vehicle } from '../models';
import { VehicleRepository } from '../repositories';
export declare class VehicleController {
    vehicleRepository: VehicleRepository;
    constructor(vehicleRepository: VehicleRepository);
    create(vehicle: Omit<Vehicle, 'vehicleId'>): Promise<string>;
    find(filter?: Filter<Vehicle>): Promise<Vehicle[]>;
    findUserVehicles(userId: string, filter?: Filter<Vehicle>): Promise<string>;
    findById(id: string, filter?: FilterExcludingWhere<Vehicle>): Promise<string>;
    updateById(id: string, vehicle: Vehicle): Promise<string>;
    deleteById(id: string): Promise<string>;
}
