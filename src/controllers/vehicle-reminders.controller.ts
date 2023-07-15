import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Vehicle,
  Reminders,
} from '../models';
import {VehicleRepository} from '../repositories';

export class VehicleRemindersController {
  constructor(
    @repository(VehicleRepository) protected vehicleRepository: VehicleRepository,
  ) { }

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
  ): Promise<Reminders[]> {
    return this.vehicleRepository.reminders(id).find(filter);
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
            optional: ['vehicleId']
          }),
        },
      },
    }) reminders: Omit<Reminders, 'reminderId'>,
  ): Promise<Reminders> {
    return this.vehicleRepository.reminders(id).create(reminders);
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
    @param.query.object('where', getWhereSchemaFor(Reminders)) where?: Where<Reminders>,
  ): Promise<Count> {
    return this.vehicleRepository.reminders(id).patch(reminders, where);
  }

  @del('/vehicles/{id}/reminders', {
    responses: {
      '200': {
        description: 'Vehicle.Reminders DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Reminders)) where?: Where<Reminders>,
  ): Promise<Count> {
    return this.vehicleRepository.reminders(id).delete(where);
  }
}
