import { Entity } from '@loopback/repository';
export declare class Reminders extends Entity {
    reminderId?: string;
    vehicleId?: string;
    plateNumber?: string;
    reminderType?: string;
    userId?: string;
    status?: string;
    comments?: string;
    isActive?: boolean;
    reminderDate?: Date;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(data?: Partial<Reminders>);
}
export interface RemindersRelations {
}
export type RemindersWithRelations = Reminders & RemindersRelations;
