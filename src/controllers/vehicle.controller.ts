import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {Vehicle} from '../models';
import {VehicleRepository} from '../repositories';

export class VehicleController {
  constructor(
    @repository(VehicleRepository)
    public vehicleRepository: VehicleRepository,
  ) { }

  @post('/vehicles/addVehicle')
  @response(200, {
    description: 'Vehicle model instance',
    content: {'application/json': {schema: getModelSchemaRef(Vehicle)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {
            title: 'NewVehicle',
            exclude: ['vehicleId'],
          }),
        },
      },
    })
    vehicle: Omit<Vehicle, 'vehicleId'>,
  ): Promise<string> {
	  const result = {code: 0, msg: "Vehicle created successfully", vehicle: {}};
    result.vehicle =  this.vehicleRepository.create(vehicle);
    return JSON.stringify(result);
  }

  @get('/vehicles/count')
  @response(200, {
    description: 'Vehicle model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Vehicle) where?: Where<Vehicle>,
  ): Promise<Count> {
    return this.vehicleRepository.count(where);
  }

  @get('/vehicles')
  @response(200, {
    description: 'Array of Vehicle model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Vehicle, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Vehicle) filter?: Filter<Vehicle>,
  ): Promise<Vehicle[]> {
    return this.vehicleRepository.find(filter);
  }

  @patch('/vehicles')
  @response(200, {
    description: 'Vehicle PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {partial: true}),
        },
      },
    })
    vehicle: Vehicle,
    @param.where(Vehicle) where?: Where<Vehicle>,
  ): Promise<Count> {
    return this.vehicleRepository.updateAll(vehicle, where);
  }

  @get('/vehicles/getVehicle/{id}')
  @response(200, {
    description: 'Vehicle model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Vehicle, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Vehicle, {exclude: 'where'}) filter?: FilterExcludingWhere<Vehicle>
  ): Promise<string> {
	  const result = {code: 0, msg: "Vehicle fetched successfully", vehicle: {}};
    result.vehicle = this.vehicleRepository.findById(id, filter);
    return JSON.stringify(result);
  }

  @post('/vehicles/updateVehicle/{id}')
  @response(200, {
    description: 'Vehicle PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Vehicle, {partial: true}),
        },
      },
    })
    vehicle: Vehicle,
  ): Promise<string> {
	  const result = {code: 0, msg: "Vehicle updated successfully.", vehicle: {}};
	  await this.vehicleRepository.updateById(id, vehicle);
    result.vehicle = this.vehicleRepository.findById(id, {});
    await this.vehicleRepository.updateById(id, vehicle);
    return JSON.stringify(result);
  }

  @put('/vehicles/{id}')
  @response(204, {
    description: 'Vehicle PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() vehicle: Vehicle,
  ): Promise<void> {
    await this.vehicleRepository.replaceById(id, vehicle);
  }

  @post('/vehicles/deleteVehicle/{id}')
  @response(204, {
    description: 'Vehicle DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {
	  const result = {code: 0, msg: "Vehicle deleted."};
    await this.vehicleRepository.deleteById(id);
    return JSON.stringify(result);
  }
}
