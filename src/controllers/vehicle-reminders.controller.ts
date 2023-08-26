import {CountSchema, Filter, repository, Where} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {Vehicle, Reminders} from '../models';
import {VehicleRepository} from '../repositories';

export class VehicleRemindersController {
  constructor(
    @repository(VehicleRepository)
    protected vehicleRepository: VehicleRepository,
  ) {}

  @get('/vehicles/{id}/getVehicleReminders', {
    responses: {
      '200': {
        description: 'Array of Vehicle has many Reminders',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Reminders)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Reminders>,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occured while getting reminders.',
      reminder: {},
    };
    try {
      result.reminder = await this.vehicleRepository.reminders(id).find(filter);
      result.code = 0;
      result.msg = 'Reminders fetched successfully.';
    } catch (e) {
      console.log(e);
    }
    return JSON.stringify(result);
  }

  @post('/vehicles/{id}/createVehicleReminders', {
    responses: {
      '200': {
        description: 'Vehicle model instance',
        content: {'application/json': {schema: getModelSchemaRef(Reminders)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Vehicle.prototype.vehicleId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reminders, {
            title: 'NewRemindersInVehicle',
            exclude: ['reminderId'],
            optional: ['vehicleId'],
          }),
        },
      },
    })
    reminders: Omit<Reminders, 'reminderId'>,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occured while creating reminder.',
      reminder: {},
    };
    try {
      result.reminder = await this.vehicleRepository
        .reminders(id)
        .create(reminders);
      result.code = 0;
      result.msg = 'Reminder created successfully.';
    } catch (e) {
      console.log(e);
    }
    return JSON.stringify(result);
  }

  @post('/vehicles/{id}/updateVehicleReminders', {
    responses: {
      '200': {
        description: 'Vehicle.Reminders PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reminders, {partial: true}),
        },
      },
    })
    reminders: Partial<Reminders>,
    @param.query.object('where', getWhereSchemaFor(Reminders))
    where?: Where<Reminders>,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occured while updating reminder.',
      reminder: {},
    };
    try {
      await this.vehicleRepository.reminders(id).patch(reminders, where);
      result.reminder = await this.vehicleRepository
        .reminders(id)
        .find({where});
      result.code = 0;
      result.msg = 'Reminder updated successfully.';
    } catch (e) {
      console.log(e);
    }
    return JSON.stringify(result);
  }

  @post('/vehicles/{id}/reminders', {
    responses: {
      '200': {
        description: 'Vehicle.Reminders DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Reminders))
    where?: Where<Reminders>,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'Some error occured while deleting reminder.',
      reminder: {},
    };
    try {
      await this.vehicleRepository.reminders(id).delete(where);
      result.code = 0;
      result.msg = 'Reminder deleted successfully.';
    } catch (e) {
      console.log(e);
    }
    return JSON.stringify(result);
  }
}
