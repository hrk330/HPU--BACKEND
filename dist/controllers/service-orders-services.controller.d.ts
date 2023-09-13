import { ServiceOrders, Services } from '../models';
import { ServiceOrdersRepository } from '../repositories';
export declare class ServiceOrdersServicesController {
    serviceOrdersRepository: ServiceOrdersRepository;
    constructor(serviceOrdersRepository: ServiceOrdersRepository);
    getServices(id: typeof ServiceOrders.prototype.serviceOrderId): Promise<Services>;
}
