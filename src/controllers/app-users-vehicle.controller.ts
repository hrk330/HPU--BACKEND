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
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  AppUsers,
  Vehicle,
} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersVehicleController {
  constructor(
    @repository(AppUsersRepository) protected appUsersRepository: AppUsersRepository,
  ) { }

  @get('/app-users/{id}/vehicles', {
    responses: {
      '200': {
        description: 'Array of AppUsers has many Vehicle',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Vehicle)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Vehicle>,
  ): Promise<Vehicle[]> {
    return this.appUsersRepository.vehicles(id).find(filter);
  }

  @post('/app-users/{id}/vehicles', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(Vehicle)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {
            title: 'NewVehicleInAppUsers',
            exclude: ['vehicleId'],
            optional: ['userId']
          }),
        },
      },
    }) vehicle: Omit<Vehicle, 'vehicleId'>,
  ): Promise<Vehicle> {
    return this.appUsersRepository.vehicles(id).create(vehicle);
  }

  @patch('/app-users/{id}/vehicles', {
    responses: {
      '200': {
        description: 'AppUsers.Vehicle PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {partial: true}),
        },
      },
    })
    vehicle: Partial<Vehicle>,
    @param.query.object('where', getWhereSchemaFor(Vehicle)) where?: Where<Vehicle>,
  ): Promise<Count> {
    return this.appUsersRepository.vehicles(id).patch(vehicle, where);
  }

  @del('/app-users/{id}/vehicles', {
    responses: {
      '200': {
        description: 'AppUsers.Vehicle DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Vehicle)) where?: Where<Vehicle>,
  ): Promise<Count> {
    return this.appUsersRepository.vehicles(id).delete(where);
  }
}
