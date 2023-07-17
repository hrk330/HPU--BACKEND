import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {ServiceProviderServices, ServiceProviderServicesRequest, Services} from '../models';
import {ServiceProviderServicesRepository, ServicesRepository} from '../repositories';

export class ServiceProviderServicesController {
  constructor(
    @repository(ServiceProviderServicesRepository)
    public serviceProviderServicesRepository : ServiceProviderServicesRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
  ) {}

  @post('/serviceProviderServices/createServices')
  @response(200, {
    description: 'ServiceProviderServices model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceProviderServices)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProviderServicesRequest, {
            title: 'NewServiceProviderServices',
          }),
        },
      },
    })
    serviceProviderServicesRequest: ServiceProviderServicesRequest,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while creating service provider services.", serviceProviderServicesList: {}};
	  const servicesArray : Array<string> = [];
	  const serviceProviderServiceMap = new Map <string, ServiceProviderServices>();
	  if(Array.isArray(serviceProviderServicesRequest?.serviceProviderServicesList) && serviceProviderServicesRequest?.serviceProviderServicesList?.length > 0) {
		  serviceProviderServicesRequest?.serviceProviderServicesList.forEach((serviceProviderService: ServiceProviderServices) =>{
				if(serviceProviderService?.serviceId) {
					servicesArray.push(serviceProviderService?.serviceId);
					serviceProviderServiceMap.set(serviceProviderService?.serviceId, serviceProviderService);
				}
		  });
			const finalServicesArray: Services[] =  await this.checkServicesExist(servicesArray);
			const serviceProviderServicesList: ServiceProviderServices[] = [];
			for (const finalService of finalServicesArray){
				const serviceProviderServices: ServiceProviderServices | undefined = serviceProviderServiceMap.get(finalService.serviceId+'');
				if(serviceProviderServices && (serviceProviderServices?.serviceId && serviceProviderServices?.userId)) {
					const serviceProviderServiceArray: Array<ServiceProviderServices> = await this.checkServiceProviderServiceExist(serviceProviderServices?.serviceId, serviceProviderServices?.userId);
					if(!serviceProviderServiceArray || serviceProviderServiceArray?.length === 0){
						const serviceProviderServiceObject: ServiceProviderServices = new ServiceProviderServices();
						serviceProviderServiceObject.serviceId = serviceProviderServices.serviceId;
						serviceProviderServiceObject.isActive = serviceProviderServices.isActive;
						serviceProviderServiceObject.userId = serviceProviderServices.userId;
						serviceProviderServiceObject.serviceName = finalService.serviceName;
						serviceProviderServiceObject.serviceType = finalService.serviceType;
						serviceProviderServiceObject.vehicleType = finalService.vehicleType;
						serviceProviderServiceObject.accidental = finalService.accidental;
						serviceProviderServicesList.push(await this.serviceProviderServicesRepository.create(serviceProviderServiceObject));
					}
				}
			};
			result.code = 0;
			result.msg = "Service provider services created successfully.";
			result.serviceProviderServicesList = serviceProviderServicesList;
	  }
	  
    return JSON.stringify(result);
  }
  
  async checkServicesExist(servicesArray :Array<string>): Promise<Array<Services>> {
	  const finalServicesArray: Array<Services> = await this.servicesRepository.find({where: {serviceId: {inq: servicesArray}}, fields: ['serviceId', 'serviceName', 'serviceType', 'vehicleType']});
	  return finalServicesArray;
  }
  
  async checkServiceProviderServiceExist(serviceId :string, userId: string): Promise<Array<ServiceProviderServices>> {
	  const serviceProviderServiceArray: Array<ServiceProviderServices> = await this.serviceProviderServicesRepository.find({where: {serviceId: serviceId, userId: userId}, fields: ['serviceId']});
	  return serviceProviderServiceArray;
  }

  @get('/serviceProviderServices/count')
  @response(200, {
    description: 'ServiceProviderServices model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ServiceProviderServices) where?: Where<ServiceProviderServices>,
  ): Promise<Count> {
    return this.serviceProviderServicesRepository.count(where);
  }

  @get('/serviceProviderServices')
  @response(200, {
    description: 'Array of ServiceProviderServices model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceProviderServices, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ServiceProviderServices) filter?: Filter<ServiceProviderServices>,
  ): Promise<ServiceProviderServices[]> {
    return this.serviceProviderServicesRepository.find(filter);
  }

  @patch('/serviceProviderServices')
  @response(200, {
    description: 'ServiceProviderServices PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProviderServices, {partial: true}),
        },
      },
    })
    serviceProviderServices: ServiceProviderServices,
    @param.where(ServiceProviderServices) where?: Where<ServiceProviderServices>,
  ): Promise<Count> {
    return this.serviceProviderServicesRepository.updateAll(serviceProviderServices, where);
  }

  @get('/serviceProviderServices/{id}')
  @response(200, {
    description: 'ServiceProviderServices model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceProviderServices, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(ServiceProviderServices, {exclude: 'where'}) filter?: FilterExcludingWhere<ServiceProviderServices>
  ): Promise<ServiceProviderServices> {
    return this.serviceProviderServicesRepository.findById(id, filter);
  }

  @patch('/serviceProviderServices/{id}')
  @response(204, {
    description: 'ServiceProviderServices PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceProviderServices, {partial: true}),
        },
      },
    })
    serviceProviderServices: ServiceProviderServices,
  ): Promise<void> {
    await this.serviceProviderServicesRepository.updateById(id, serviceProviderServices);
  }

  @put('/serviceProviderServices/{id}')
  @response(204, {
    description: 'ServiceProviderServices PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() serviceProviderServices: ServiceProviderServices,
  ): Promise<void> {
    await this.serviceProviderServicesRepository.replaceById(id, serviceProviderServices);
  }

  @del('/serviceProviderServices/{id}')
  @response(204, {
    description: 'ServiceProviderServices DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.serviceProviderServicesRepository.deleteById(id);
  }
}
