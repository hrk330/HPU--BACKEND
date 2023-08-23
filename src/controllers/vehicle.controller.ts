import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
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
    result.vehicle = await this.vehicleRepository.create(vehicle);
    return JSON.stringify(result);
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
  
  @get('/getUserVehicles/{userId}')
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
  async findUserVehicles(
	  @param.path.string('userId') userId: string,
    @param.filter(Vehicle) filter?: Filter<Vehicle>,
  ): Promise<string> {
	  filter = {...filter, where: {userId: userId}};
    const result = {code: 0, msg: "Vehicle fetched successfully", vehicle: {}};
    result.vehicle = await this.vehicleRepository.find(filter);
    return JSON.stringify(result);
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
    result.vehicle = await this.vehicleRepository.findById(id, filter);
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
    result.vehicle = await this.vehicleRepository.findById(id, {});
    return JSON.stringify(result);
  }

  @post('/vehicles/deleteVehicle/{id}')
  @response(200, {
    description: 'Vehicle DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<string> {
	  const result = {code: 0, msg: "Vehicle deleted."};
    await this.vehicleRepository.deleteById(id);
    return JSON.stringify(result);
  }
}
