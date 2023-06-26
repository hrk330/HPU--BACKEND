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
import {Account, AppUsers, OrderRequest, Payment, PromoCodes, ServiceOrders, Services} from '../models';
import {AppUsersRepository, PaymentRepository, PromoCodesRepository, ServiceOrdersRepository, ServicesRepository} from '../repositories';
import {sendMessage} from '../services/firebase-notification.service';
//import _ from 'lodash';

export class ServiceOrdersController {
  constructor(
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
    @repository(AppUsersRepository)
    public appUsersRepository: AppUsersRepository,
    @repository(ServicesRepository)
    public servicesRepository: ServicesRepository,
    @repository(PaymentRepository)
    public paymentRepository : PaymentRepository,
    @repository(PromoCodesRepository)
    public promoCodesRepository: PromoCodesRepository,
  ) { }
  
  @post('/serviceOrders/adminUser/createOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async adminCreateOrder(
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
  ): Promise<string> {
    
    const result = {code: 5, msg: "Some error occured while creating order.", order: {}};
    try {
			serviceOrders.status = "AC";
	    const service: Services = await this.servicesRepository.findById(serviceOrders.serviceId);
	    serviceOrders.taxPercentage = service.salesTax;
	    serviceOrders.distanceAmount = service.pricePerKm * serviceOrders.distance;
	    serviceOrders.grossAmount = service.price + serviceOrders.distanceAmount;
	    serviceOrders.taxAmount = serviceOrders.grossAmount * serviceOrders.taxPercentage / 100;
	    serviceOrders.netAmount = serviceOrders.grossAmount + serviceOrders.taxAmount;
	    if(serviceOrders?.promoCode) {
				const promoCodeObj: PromoCodes| null = await this.promoCodesRepository.findOne({where: {promoCode: serviceOrders.promoCode}});
				if(promoCodeObj?.promoId) {
					const userOrdersWithPromoCode: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {userId: serviceOrders.userId, promoCode: serviceOrders.promoCode}, fields: ['serviceOrderId']});
					if(promoCodeObj.totalUsed < promoCodeObj.totalLimit && (userOrdersWithPromoCode &&  userOrdersWithPromoCode.length < promoCodeObj.userLimit)){
						
						let promoDiscount = 0;
						if(promoCodeObj.discountType === 'R'){
							if(promoCodeObj.discountValue < service.price){
								promoDiscount = promoCodeObj.discountValue;	
							} else {
								promoDiscount = service.price;
							}
						}	else if(promoCodeObj.discountType === 'P'){
							promoDiscount = service.price * promoCodeObj.discountValue / 100;
						}
						serviceOrders.discountAmount = promoDiscount;
						serviceOrders.promoCode = promoCodeObj.promoCode;
						serviceOrders.promoId = promoCodeObj.promoId;
						serviceOrders.discountType = promoCodeObj.discountType;
						serviceOrders.discountValue = promoCodeObj.discountValue;
						serviceOrders.grossAmount -= promoDiscount;
						serviceOrders.taxAmount = serviceOrders.grossAmount * serviceOrders.taxPercentage / 100;
	    			serviceOrders.netAmount = serviceOrders.grossAmount + serviceOrders.taxAmount;
	   	
						promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
						promoCodeObj.updatedAt = new Date();
						await this.promoCodesRepository.updateById(promoCodeObj?.promoId, promoCodeObj);			
					}
				}
			}
			
	    const createdOrder: ServiceOrders = await this.serviceOrdersRepository.create(serviceOrders);
	    const serviceProvider: AppUsers = await this.appUsersRepository.findById(createdOrder.serviceProviderId, {fields: ['endpoint']});
    
		  if(serviceProvider?.endpoint?.length > 20){
	    	await this.sendOrderNotification(serviceProvider, "Order Alert", "New order has been assigned.", createdOrder);
  		}
  		
  		const appUser: AppUsers = await this.appUsersRepository.findById(createdOrder.userId, {fields: ['endpoint']});
  		
  		if(appUser?.endpoint?.length > 20){
	    	await this.sendOrderNotification(appUser, "Order Alert", "New order has been created.", createdOrder);
  		}
  		
  		result.code = 0;
  		result.msg = "Order created successfully";
  		result.order = createdOrder;
    } catch(e) {
			console.log(e);
      result.code = 5;
      result.msg = e.message;
		}
    return JSON.stringify(result);
  }

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
    serviceOrders.distanceAmount = service.pricePerKm * serviceOrders.distance;
    serviceOrders.grossAmount = service.price + serviceOrders.distanceAmount;
    serviceOrders.taxAmount = serviceOrders.grossAmount * serviceOrders.taxPercentage / 100;
    serviceOrders.netAmount = serviceOrders.grossAmount + serviceOrders.taxAmount;
    const createdOrder: ServiceOrders = await this.serviceOrdersRepository.create(serviceOrders);
    const serviceProviders: AppUsers[] = await this.appUsersRepository.find({where: {roleId: 'SERVICEPROVIDER', userStatus: 'A'}, fields: ['endpoint']});
    if (Array.isArray(serviceProviders) && serviceProviders.length > 0) {
      for(const serviceProvider of serviceProviders) {
			  if(serviceProvider?.endpoint?.length > 20){
		    	await this.sendOrderNotification(serviceProvider, "Order Alert", "A new order is available.", createdOrder);
	    	}
	    }
    }
    return createdOrder;
  }

  async sendOrderNotification(appUser: AppUsers, title: string, body: string, order: ServiceOrders): Promise<void> {
    
      await sendMessage({
		  notification: { title: title, body: body}, 
	      data: { orderId: order.serviceOrderId+'', serviceName: order.serviceName+'', creationTime: order.createdAt+'', serviceType: order.serviceType+'', 
	      	orderStatus: order.status+'', price: order.netAmount+''
	      },
	      token: appUser?.endpoint
      });
  }
  
  @post('/serviceOrders/serviceProvider/updateOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async updateOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while updating order.", order: {}};
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
    if((dbOrder?.status && "UC,SC".indexOf(dbOrder?.status) < 0) && (serviceOrders && !serviceOrders.status) || (serviceOrders?.status && "LO,AC,AR,ST,CO".indexOf(serviceOrders.status) >= 0)) {
	    try {
			
				await this.populateStatusDates(serviceOrders);
		    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
	 			dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
		 		
		    await this.sendOrderUpdateNotification(dbOrder);
	      result = {code: 0, msg: "Order updated successfully.", order: dbOrder};      
	    } catch (e) {
	      console.log(e);
	      result.code = 5;
	      result.msg = e.message;
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/serviceProvider/completeOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async completeOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderRequest, {partial: true}),
        },
      },
    })
    orderRequest: OrderRequest,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while completing order.", order: {}, user: {}};
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
    if((dbOrder?.status && "UC,SC".indexOf(dbOrder?.status) < 0) && (orderRequest?.serviceOrder?.status === "CO" && orderRequest?.serviceOrder?.serviceOrderId)) {	
	    try {
				await this.populateStatusDates(orderRequest.serviceOrder);
				
				await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
				dbOrder = await this.serviceOrdersRepository.findById(orderRequest.serviceOrder.serviceOrderId);
				const appUser: AppUsers[] = await this.appUsersRepository.find({where: {roleId: 'APPUSER', id: dbOrder.userId}});
		    await this.sendOrderUpdateNotification(dbOrder);
	      result = {code: 0, msg: "Order completed successfully.", order: dbOrder, user: appUser};      
	    } catch (e) {
	      console.log(e);
	      result.code = 5;
	      result.msg = e.message;
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/appUser/initiatePayment')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async initiatePayment(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderRequest, {partial: true}),
        },
      },
    })
    orderRequest: OrderRequest,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while initiating payment.", order: {}};
    if(orderRequest?.serviceOrder?.serviceOrderId) {
	    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(orderRequest?.serviceOrder?.serviceOrderId);
	    if((dbOrder && dbOrder.status === 'CO' && orderRequest?.serviceOrder?.status === "PI")) {
		    try {
					await this.populateStatusDates(orderRequest.serviceOrder);
					
					if(orderRequest.payment.paymentAmount >= dbOrder?.netAmount) {
						if((orderRequest.payment.paymentAmount - dbOrder.netAmount) > 0) {
							const extraAmount = orderRequest.payment.paymentAmount - dbOrder.netAmount;
							const userAccount: Account = await this.appUsersRepository.account(dbOrder.userId).get({});
							const creditAmount = extraAmount + userAccount.balanceAmount;
							await this.appUsersRepository.account(dbOrder.userId).patch({balanceAmount: creditAmount}, {});
							const serviceProviderAccount: Account = await this.appUsersRepository.account(dbOrder.serviceProviderId).get({});
							const debitAmount = serviceProviderAccount.balanceAmount - extraAmount;
							await this.appUsersRepository.account(dbOrder.serviceProviderId).patch({balanceAmount: debitAmount}, {});
						}
						orderRequest.payment.payerId = dbOrder.userId;
						orderRequest.payment.receiverId = dbOrder.serviceProviderId;
						orderRequest.payment.paymentOrderId = dbOrder.serviceOrderId;
						orderRequest.payment.paymentStatus = "L";
						await this.paymentRepository.create(orderRequest.payment);
				    await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
				    if(dbOrder?.promoId && dbOrder.orderType === 'U') {
				    	const promoCodeObj: PromoCodes = await this.promoCodesRepository.findById(dbOrder.promoId, {});
				    	if(promoCodeObj) {
								promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
								promoCodeObj.updatedAt = new Date();
								await this.promoCodesRepository.updateById(dbOrder.promoId, promoCodeObj);
							}
						}
				    
				    dbOrder = await this.serviceOrdersRepository.findById(orderRequest?.serviceOrder?.serviceOrderId);
				    const serviceProvider: AppUsers = await this.appUsersRepository.findById(dbOrder.serviceProviderId, {fields: ['endpoint']});
    
					  if(serviceProvider?.endpoint?.length > 20){
				    	await this.sendOrderNotification(serviceProvider, "Order Alert", "Payment has been initiated.", dbOrder);
			  		}
				    result = {code: 0, msg: "Payment completed successfully.", order: dbOrder}; 
		 			} else {
						 result.msg = "Payment is less than the due amount.";
					}
		           
		    } catch (e) {
		      console.log(e);
		      result.code = 5;
		      result.msg = e.message;
		    }
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/serviceProvider/completePayment')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async completePayment(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderRequest, {partial: true}),
        },
      },
    })
    orderRequest: OrderRequest,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while completing payment.", order: {}};
    if(orderRequest?.serviceOrder?.serviceOrderId) {
	    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(orderRequest?.serviceOrder?.serviceOrderId);
	    if((dbOrder && dbOrder.status === 'PI' && orderRequest?.serviceOrder?.status === "PC")) {
		    try {
					await this.populateStatusDates(orderRequest.serviceOrder);
					
					const paymentObj: Payment | null = await this.paymentRepository.findOne({where: {paymentOrderId: orderRequest.serviceOrder.serviceOrderId}});
					if(paymentObj){
						paymentObj.paymentStatus = "C";
						await this.paymentRepository.updateById(paymentObj.paymentId, paymentObj);
					  await this.serviceOrdersRepository.updateById(orderRequest.serviceOrder.serviceOrderId, orderRequest.serviceOrder);
				    dbOrder = await this.serviceOrdersRepository.findById(orderRequest?.serviceOrder?.serviceOrderId);
				    const serviceProvider: AppUsers = await this.appUsersRepository.findById(dbOrder.userId, {fields: ['endpoint']});
  
				  if(serviceProvider?.endpoint?.length > 20){
			    	await this.sendOrderNotification(serviceProvider, "Order Alert", "Payment has been completed.", dbOrder);
		  		}
				    result = {code: 0, msg: "Payment completed successfully.", order: dbOrder};
			    } 
	 			     
		    } catch (e) {
		      console.log(e);
		      result.code = 5;
		      result.msg = e.message;
		    }
	    }
    }
    return JSON.stringify(result);
  }
  
  
  async sendOrderUpdateNotification(serviceOrders: ServiceOrders): Promise<void>{
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
			} else if(serviceOrders?.status === "PC") {
				title = "Payment Completed"; 
				body = "Your payment has been completed.";
			}
		
			await this.sendOrderNotification(appUser, title, body, serviceOrders);
		}
  }
  
  async populateStatusDates(serviceOrders: ServiceOrders): Promise<void> {
	  const date = new Date();
	  if(serviceOrders?.status) {	
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
		serviceOrders.updatedAt = date;
  }
  
  @post('/serviceOrders/serviceProvider/rateOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async rateOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrder: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while rating order.", order: {}};
    if((serviceOrder?.rating && serviceOrder?.serviceOrderId)) {	
	    try {
				serviceOrder.updatedAt = new Date();
				
				await this.serviceOrdersRepository.updateById(serviceOrder.serviceOrderId, serviceOrder);
				const dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrder.serviceOrderId);
				
				const serviceProviderOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceProviderId: dbOrder.serviceProviderId, rating: {gt: 0}}});
				let serviceProviderRating = 0;
				if(serviceProviderOrders?.length > 0) {
					let totalRating = 0;
					serviceProviderOrders.forEach((order) => {
						if(order?.rating) {
							totalRating += order.rating;	
						}
						
					});
					serviceProviderRating = totalRating/serviceProviderOrders.length;	
				}
				
				await this.appUsersRepository.updateById(dbOrder.serviceProviderId, {rating: serviceProviderRating});
				
		    //await this.sendOrderUpdateNotification(dbOrder);
	      result = {code: 0, msg: "Order rated successfully.", order: dbOrder};      
	    } catch (e) {
	      console.log(e);
	      result.code = 5;
	      result.msg = e.message;
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/serviceProvider/cancelOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async serviceProviderCancelOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while canceling order.", order: {}};
    if(serviceOrders?.serviceOrderId){
	    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
	    
	    if((dbOrder?.status && "AC,AR,ST".indexOf(dbOrder?.status) >= 0) && (serviceOrders?.status && "SC".indexOf(serviceOrders.status) >= 0) && dbOrder.serviceProviderId+'' === serviceOrders.serviceProviderId+'') {
		    try {
					await this.populateStatusDates(serviceOrders);
			    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
		 			dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
	    		
	    		if(dbOrder?.userId){
						const appUser: AppUsers = await this.appUsersRepository.findById(dbOrder.userId, {fields: ['endpoint']});
					  if(appUser?.endpoint?.length > 20){
				    	await this.sendOrderNotification(appUser, "Order Alert", "Order has been canceled.", dbOrder);
			  		}
		  		}
			 		
		      result = {code: 0, msg: "Order canceled.", order: dbOrder};      
		    } catch (e) {
		      console.log(e);
		      result.code = 5;
		      result.msg = e.message;
		    }
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/appUser/cancelOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async appUserCancelOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while canceling order.", order: {}};
    if(serviceOrders?.serviceOrderId){
	    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
	    if((dbOrder?.status && "LO,AC,AR".indexOf(dbOrder?.status) >= 0) && (serviceOrders?.status && "UC".indexOf(serviceOrders.status) >= 0)) {
		    try {
				
					await this.populateStatusDates(serviceOrders);
			    await this.serviceOrdersRepository.updateById(serviceOrders.serviceOrderId, serviceOrders);
		 			dbOrder = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
		 			if(dbOrder?.serviceProviderId){
	    			const serviceProvider: AppUsers = await this.appUsersRepository.findById(dbOrder.serviceProviderId, {fields: ['endpoint']});
		  			if(serviceProvider?.endpoint?.length > 20){
				    	await this.sendOrderNotification(serviceProvider, "Order Alert", "Order has been canceled.", dbOrder);
			  		}
	  			}
			 	
		      result = {code: 0, msg: "Order canceled.", order: dbOrder};      
		    } catch (e) {
		      console.log(e);
		      result.code = 5;
		      result.msg = e.message;
		    }
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/appUser/applyPromoCode')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async appUserApplyPromoCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while applying promo code.", order: {}};
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(serviceOrders.serviceOrderId);
    
    const promoCodeObj: PromoCodes| null = await this.promoCodesRepository.findOne({where: {promoCode: serviceOrders.promoCode}});
    if(promoCodeObj && dbOrder) {
	    try {
				const userOrdersWithPromoCode: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {userId: dbOrder.userId, promoCode: serviceOrders.promoCode}, fields: ['serviceOrderId']});
				if(promoCodeObj.totalUsed < promoCodeObj.totalLimit && (userOrdersWithPromoCode &&  userOrdersWithPromoCode.length < promoCodeObj.userLimit)){
					
					let promoDiscount = 0;
					if(promoCodeObj.discountType === 'R'){
						if(promoCodeObj.discountValue < dbOrder.grossAmount){
							promoDiscount = promoCodeObj.discountValue;	
						} else {
							promoDiscount = dbOrder.grossAmount;
						}
					}	else if(promoCodeObj.discountType === 'P'){
						promoDiscount = dbOrder.grossAmount * (promoCodeObj.discountValue/100)
					}
					dbOrder.discountAmount = promoDiscount;
					dbOrder.promoCode = promoCodeObj.promoCode;
					dbOrder.promoId = promoCodeObj.promoId;
					dbOrder.discountType = promoCodeObj.discountType;
					dbOrder.discountValue = promoCodeObj.discountValue;
					dbOrder.grossAmount -= promoDiscount;
					dbOrder.taxAmount = serviceOrders.grossAmount * serviceOrders.taxPercentage / 100;
    			dbOrder.netAmount = serviceOrders.grossAmount + serviceOrders.taxAmount;
					
					dbOrder.updatedAt = new Date();
			    await this.serviceOrdersRepository.updateById(dbOrder.serviceOrderId, dbOrder);
		 			dbOrder = await this.serviceOrdersRepository.findById(dbOrder.serviceOrderId);
		 			
		 			if(dbOrder?.serviceProviderId){
	    			const serviceProvider: AppUsers = await this.appUsersRepository.findById(dbOrder.serviceProviderId, {fields: ['endpoint']});
		  			if(serviceProvider?.endpoint?.length > 20){
				    	await this.sendOrderNotification(serviceProvider, "Order Alert", "A promo code has been applyed by the user.", dbOrder);
			  		}
	  			}
	     		
		      result = {code: 0, msg: "Promo code applied successfully.", order: dbOrder};
	      } else if(promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
			  	result.msg = "Coupon has reached its limit.";
		  	} else if(userOrdersWithPromoCode &&  userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
				  result.msg = "User has reached this coupons limit.";
			  } 	     
	    } catch (e) {
	      console.log(e);
	      result.code = 5;
	      result.msg = e.message;
	    }
    }
    return JSON.stringify(result);
  }
  
  @post('/serviceOrders/adminUser/applyPromoCode')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async adminUserApplyPromoCode(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {code: 5, msg: "Some error occured while getting promo info.", order: {}};
    if(serviceOrders?.serviceId && serviceOrders?.promoCode && serviceOrders?.userId) {
	    const promoCodeObj: PromoCodes| null = await this.promoCodesRepository.findOne({where: {promoCode: serviceOrders.promoCode}});
	    const service: Services = await this.servicesRepository.findById(serviceOrders.serviceId);
	    if(promoCodeObj && service) {
		    try {
					const userOrdersWithPromoCode: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {userId: serviceOrders.userId, promoCode: serviceOrders.promoCode}, fields: ['serviceOrderId']});
					if(promoCodeObj.totalUsed < promoCodeObj.totalLimit && (userOrdersWithPromoCode &&  userOrdersWithPromoCode.length < promoCodeObj.userLimit)){
						
						let promoDiscount = 0;
						if(promoCodeObj.discountType === 'R'){
							if(promoCodeObj.discountValue < service.price){
								promoDiscount = promoCodeObj.discountValue;	
							} else {
								promoDiscount = service.price;
							}
						}	else if(promoCodeObj.discountType === 'P'){
							promoDiscount = service.price * (promoCodeObj.discountValue/100)
						}
						serviceOrders.discountAmount = promoDiscount;
						serviceOrders.promoCode = promoCodeObj.promoCode;
						serviceOrders.promoId = promoCodeObj.promoId;
						serviceOrders.discountType = promoCodeObj.discountType;
						serviceOrders.discountValue = promoCodeObj.discountValue;
						serviceOrders.netAmount = service.price - promoDiscount;
						
			      result = {code: 0, msg: "Promo code applied successfully.", order: serviceOrders};
		      } else if(promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
				  	result.msg = "Coupon has reached its limit.";
			  	} else if(userOrdersWithPromoCode &&  userOrdersWithPromoCode.length < promoCodeObj.userLimit) {
					  result.msg = "User has reached this coupons limit.";
				  } 	     
		    } catch (e) {
		      console.log(e);
		      result.code = 5;
		      result.msg = e.message;
		    }
	    }
    }
    return JSON.stringify(result);
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
        if(orders?.length > 0) {
					for(const order of orders) {
						if(order.serviceProviderId) {
							const serviceProvider = await this.appUsersRepository.findById(order.serviceProviderId);
							order.serviceProvider = serviceProvider;
						}
					}
				}
        
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
    let result = {code: 5, msg: "Some error occured while getting order details.", orders: {}, serviceProvider: {}};
    try {
      if (appUserId?.length > 0 && serviceOrderId?.length > 0) {
        const dbServiceOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceOrderId: serviceOrderId, userId: appUserId}});
        if(dbServiceOrders?.length > 0) {
					let serviceProvider = {};
					if(dbServiceOrders[0]?.serviceProviderId) {
						serviceProvider = await this.appUsersRepository.findById(dbServiceOrders[0].serviceProviderId);	
					}
          result = {code: 0, msg: "Orders fetched successfully.", orders: dbServiceOrders[0], serviceProvider: serviceProvider};
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

	@get('/serviceOrders/getCurrentOrder/{userType}/{userId}/')
  @response(200, {
    description: 'Array of AppUsers model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(AppUsers, {includeRelations: true}),
        },
      },
    },
  })
  async getCurrentOrder(
    @param.path.string('userType') userType: string,
    @param.path.string('userId') userId: string,
  ): Promise<string> {
	  const result = {code: 0, msg: "Order fetched successfully.", order: {}};
	  let dbServiceOrders: ServiceOrders[] = [];
	  if(userType === "U") {
			dbServiceOrders = await this.serviceOrdersRepository.find({where: {userId: userId, status: {inq: ['LO','AC','AR','ST','CO','PI']}}});  
	  } else if(userType === "S") {
		  dbServiceOrders = await this.serviceOrdersRepository.find({where: {serviceProviderId: userId, status: {inq: ['LO','AC','AR','ST','CO','PI']}}});
	  }
    
    if(dbServiceOrders?.length > 0) {
      result.order = dbServiceOrders[0];
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
