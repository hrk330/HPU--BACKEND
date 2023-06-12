import {
  Count,
  CountSchema,
  repository,
  Where
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {AppUsers, ServiceOrders, Services} from '../models';
import {AppUsersRepository, ServiceOrdersRepository, ServicesRepository} from '../repositories';
import {sendMessage} from '../services/firebase-notification.service';
import _ from 'lodash';

export class ServiceOrdersController {
  constructor(
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
  ) { }

  @post('/serviceOrders/appUser/createOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {
            title: 'NewServiceOrders',
            exclude: ['serviceOrderId'],
          }),
        },
      },
    })
    serviceOrders: Omit<ServiceOrders, 'serviceOrderId'>,
  ): Promise<ServiceOrders> {
    serviceOrders.status = "LO";
    const service: Services = await this.servicesRepository.findById(serviceOrders.serviceId);
    serviceOrders.taxPercentage = service.salesTax;
    const createdOrder: ServiceOrders = await this.serviceOrdersRepository.create(_.pick(serviceOrders, ['userId', 'serviceId', 'serviceName', 'serviceType', 'vehicleType', 'pickupLocation',
        'pickupLocationCoordinates', 'dropLocation', 'dropLocationCoordinates', 'instructions', 'promoId', 'promoCode', 'discountValue', 'discountType', 'status', 'taxPercentage'
      ]
    ));
    const serviceProviders: AppUsers[] = await this.appUsersRepository.find({where: {roleId: 'SERVICEPROVIDER', userStatus: 'A'}, fields: ['endpoint']});
    if (Array.isArray(serviceProviders) && serviceProviders.length > 0) {
      for(const serviceProvider of serviceProviders) {
			  if(serviceProvider?.endpoint?.length > 20){
		    	await this.sendOrderNotification(serviceProvider, "Order Alert", "A new order is available.", createdOrder.serviceOrderId);
	    	}
	    }
    }
    return createdOrder;
  }

  async sendOrderNotification(appUser: AppUsers, title: string, body: string, orderId: string): Promise<void> {
    
      await sendMessage({notification: { title: title, body: body}, data: { orderId: orderId+''}, token: appUser?.endpoint});
  }
  
  @post('/serviceOrders/serviceProvider/updateOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async acceptOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting order.", order: {}};
    if((serviceOrders && !serviceOrders.status) || (serviceOrders?.status && "LO,AC,AR,ST,CO".indexOf(serviceOrders.status) >= 0)) {
	    try {
			
				await this.populateStatusDates(serviceOrders);
		    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
		 		const order: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
		 		serviceOrders.serviceOrderId = order.serviceOrderId;
		 		serviceOrders.userId = order.userId;
		    await this.sendOrderUpdateNotification(serviceOrders);
	      result = {code: 0, msg: "Order updated successfully.", order: order};      
	    } catch (e) {
	      console.log(e);
	      result.code = 5;
	      result.msg = e.message;
	    }
    }
    return JSON.stringify(result);
  }
  
  async sendOrderUpdateNotification(serviceOrders: ServiceOrders, ): Promise<void>{
	  let title = "", body = "";
    if(serviceOrders?.status) {
			const appUser: AppUsers = await this.appUsersRepository.findById(serviceOrders.userId, {fields: ['endpoint']});
			if(serviceOrders?.status === "AC") {				
				title = "Order Accepted"; 
				body = "Your Order has been accepted.";
			} else if(serviceOrders?.status === "AR") {
				title = "Service Provider Arrived"; 
				body = "Service Provider has arrived at your location.";
			} else if(serviceOrders?.status === "ST") {
				title = "Order Started"; 
				body = "Your order has started.";
			} else if(serviceOrders?.status === "CO") {
				title = "Order Completed"; 
				body = "Your Order has been completed.";
			}
		
			await this.sendOrderNotification(appUser, title, body, serviceOrders.serviceOrderId);
		}
  }
  
  async populateStatusDates(serviceOrders: ServiceOrders): Promise<void> {
	  if(serviceOrders?.status) {
		  const date = new Date();	
			if(serviceOrders?.status === "AC") {
				serviceOrders.acceptedAt = date;								
			} else if(serviceOrders?.status === "AR") {
				serviceOrders.arrivedAt = date;
			} else if(serviceOrders?.status === "ST") {
				serviceOrders.startedAt = date;				
			} else if(serviceOrders?.status === "CO") {
				serviceOrders.completedAt = date;
			}
		}
  }

  @get('/serviceOrders/serviceProvider/getAllOrders/{serviceProviderId}')
  @response(200, {
    description: 'Array of ServiceOrders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.path.string('serviceProviderId') serviceProviderId: string,
  ): Promise<Object> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (serviceProviderId && serviceProviderId.length > 0) {
        const orders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceProviderId: serviceProviderId}})
        result = {code: 0, msg: "Orders fetched successfully.", orders: orders};
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }
  
  @get('/serviceOrders/adminUser/getAllOrders')
  @response(200, {
    description: 'Array of ServiceOrders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
        },
      },
    },
  })
  async getAllOrdersForAdmin(): Promise<Object> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
        const orders: ServiceOrders[] = await this.serviceOrdersRepository.find();
        result = {code: 0, msg: "Orders fetched successfully.", orders: orders};      
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }
  
  @get('/serviceOrders/adminUser/getOrderDetails/{serviceOrderId}')
  @response(200, {
    description: 'Array of ServiceOrders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
        },
      },
    },
  })
  async getOrderDetailsForAdmin(@param.path.string('serviceOrderId') serviceOrderId: string,): Promise<Object> {
    let result = {code: 5, msg: "Some error occured while getting order.", order: {}};
    try {
        const order: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrderId);
        result = {code: 0, msg: "Order fetched successfully.", order: order};      
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @get('/serviceOrders/count')
  @response(200, {
    description: 'ServiceOrders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ServiceOrders) where?: Where<ServiceOrders>,
  ): Promise<Count> {
    return this.serviceOrdersRepository.count(where);
  }

  @get('/serviceOrders/sendNotification/{token}')
  @response(200, {
    description: 'ServiceOrders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async sendNotification(
    @param.path.string('token') token: string,
  ): Promise<string> {
    await sendMessage({notification: {title: "Test Notification ", body: "This is a sample test msg."}, data:{}, token: token});
    return "SUCCESS";
  }

  @patch('/serviceOrders')
  @response(200, {
    description: 'ServiceOrders PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
    @param.where(ServiceOrders) where?: Where<ServiceOrders>,
  ): Promise<Count> {
    return this.serviceOrdersRepository.updateAll(serviceOrders, where);
  }

  @get('/serviceOrders/serviceProvider/getServiceOrderDetails/{serviceOrderId}/{serviceProviderId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
      },
    },
  })
  async findByServiceProviderId(
    @param.path.string('serviceOrderId') serviceOrderId: string,
    @param.path.string('serviceProviderId') serviceProviderId: string,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (serviceProviderId?.length > 0 && serviceOrderId?.length > 0) {
        const dbServiceOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceOrderId: serviceOrderId, serviceProviderId: serviceProviderId}});
        if(dbServiceOrders && dbServiceOrders.length > 0) {
          result = {code: 0, msg: "Orders fetched successfully.", orders: dbServiceOrders};
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @get('/serviceOrders/appUser/getServiceOrderDetails/{serviceOrderId}/{appUserId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
      },
    },
  })
  async findByAppUserId(
    @param.path.string('serviceOrderId') serviceOrderId: string,
    @param.path.string('appUserId') appUserId: string,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (appUserId?.length > 0 && serviceOrderId?.length > 0) {
        const dbServiceOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceOrderId: serviceOrderId, userId: appUserId}});
        if(dbServiceOrders?.length > 0) {
          result = {code: 0, msg: "Orders fetched successfully.", orders: dbServiceOrders[0]};
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }
  
  @get('/serviceOrders/appUser/getUserServiceOrders/{appUserId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ServiceOrders, {includeRelations: true}),
      },
    },
  })
  async findUserServiceOrders(    
    @param.path.string('appUserId') appUserId: string,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting orders.", orders: {}};
    try {
      if (appUserId?.length > 0) {
        const dbServiceOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {userId: appUserId}});
        if(dbServiceOrders && dbServiceOrders.length > 0) {
          result = {code: 0, msg: "Orders fetched successfully.", orders: dbServiceOrders};
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @patch('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<void> {
    await this.serviceOrdersRepository.updateById(id, serviceOrders);
  }

  @put('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() serviceOrders: ServiceOrders,
  ): Promise<void> {
    await this.serviceOrdersRepository.replaceById(id, serviceOrders);
  }

  @del('/serviceOrders/{id}')
  @response(204, {
    description: 'ServiceOrders DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.serviceOrdersRepository.deleteById(id);
  }
}
