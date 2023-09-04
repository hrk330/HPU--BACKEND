import {authenticate} from '@loopback/authentication';
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
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {
  Account,
  AppUsers,
  Company,
  OrderRequest,
  Payment,
  PromoCodes,
  ServiceOrders,
  ServiceProvider,
  Services,
  Transaction,
  TransactionResponse,
} from '../models';
import {
  AppUsersRepository,
  PaymentRepository,
  PromoCodesRepository,
  ServiceOrdersRepository,
  ServiceProviderRepository,
  ServicesRepository,
  TransactionRepository,
  CompanyRepository,
} from '../repositories';
import {sendMessage} from '../services';
import {sendCustomMail} from '../services';
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
    public paymentRepository: PaymentRepository,
    @repository(PromoCodesRepository)
    public promoCodesRepository: PromoCodesRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(CompanyRepository) // Inject the CompanyRepository
    public companyRepository: CompanyRepository,
  ) {}

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
    const result = {
      code: 5,
      msg: 'Some error occurred while creating order.',
      order: {},
    };
    try {
      const serviceProvider: ServiceProvider = await this.getServiceProvider(
        serviceOrders?.serviceProviderId,
      );
      const company: Company = await this.getCompany(
        serviceOrders?.companyId as string,
      );

      const service: Services = await this.servicesRepository.findById(
        serviceOrders.serviceId,
      );
      const appUser: AppUsers = await this.appUsersRepository.findById(
        serviceOrders.userId,
        {fields: ['id', 'email', 'firstName', 'lastName', 'endpoint']},
      );

      if (service && appUser) {
        if (
          serviceOrders?.serviceProviderId &&
          !(service.serviceType === 'Done For You')
        ) {
          serviceOrders.status = 'OA';
        } else {
          serviceOrders.status = 'LO';
        }
        serviceOrders.userName = appUser.firstName + ' ' + appUser.lastName;
        serviceOrders.userEmail = appUser.email;
        if (
          serviceProvider?.firstName &&
          serviceProvider?.lastName &&
          serviceProvider?.email
        ) {
          serviceOrders.serviceProviderName =
            serviceProvider.firstName + ' ' + serviceProvider.lastName;
          serviceOrders.serviceProviderEmail = serviceProvider.email;
        }
        serviceOrders.taxPercentage = service.salesTax;
        serviceOrders.serviceName = service.serviceName;
        serviceOrders.serviceType = service.serviceType;
        serviceOrders.serviceFee = 0;
        if (service.serviceFee) {
          serviceOrders.serviceFee = service.serviceFee;
        }

        if (serviceOrders?.distance) {
          serviceOrders.distanceAmount =
            service.pricePerKm * serviceOrders.distance;
          serviceOrders.grossAmount =
            service.price + serviceOrders.distanceAmount;
        } else {
          serviceOrders.grossAmount = service.price;
        }
        if (!serviceOrders.serviceFeePaid) {
          serviceOrders.grossAmount += serviceOrders.serviceFee;
        }
        if (serviceOrders.taxPercentage) {
          serviceOrders.taxAmount =
            serviceOrders.grossAmount * (serviceOrders.taxPercentage / 100);
        } else {
          serviceOrders.taxAmount = 0;
        }
        serviceOrders.netAmount =
          serviceOrders.grossAmount + serviceOrders.taxAmount;

        if (serviceOrders?.promoCode) {
          const promoCodeObj: PromoCodes | null =
            await this.promoCodesRepository.findOne({
              where: {promoCode: serviceOrders.promoCode},
            });
          if (promoCodeObj?.promoId) {
            const userOrdersWithPromoCode: ServiceOrders[] =
              await this.serviceOrdersRepository.find({
                where: {
                  userId: serviceOrders.userId,
                  promoCode: serviceOrders.promoCode,
                },
                fields: ['serviceOrderId'],
              });
            if (
              promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
              userOrdersWithPromoCode &&
              userOrdersWithPromoCode.length < promoCodeObj.userLimit
            ) {
              let promoDiscount = 0;
              if (promoCodeObj.discountType === 'R') {
                if (promoCodeObj.discountValue < service.price) {
                  promoDiscount = promoCodeObj.discountValue;
                } else {
                  promoDiscount = serviceOrders.grossAmount;
                }
              } else if (promoCodeObj.discountType === 'P') {
                promoDiscount =
                  serviceOrders.grossAmount *
                  (promoCodeObj.discountValue / 100);
              }
              serviceOrders.discountAmount = promoDiscount;
              serviceOrders.promoCode = promoCodeObj.promoCode;
              serviceOrders.promoId = promoCodeObj.promoId;
              serviceOrders.discountType = promoCodeObj.discountType;
              serviceOrders.discountValue = promoCodeObj.discountValue;
              if (!serviceOrders.serviceFeePaid) {
                serviceOrders.grossAmount += serviceOrders.serviceFee;
              }
              if (serviceOrders.taxPercentage) {
                serviceOrders.taxAmount =
                  (serviceOrders.grossAmount - promoDiscount) *
                  (serviceOrders.taxPercentage / 100);
              } else {
                serviceOrders.taxAmount = 0;
              }
              serviceOrders.netAmount =
                serviceOrders.grossAmount -
                promoDiscount +
                serviceOrders.taxAmount;

              promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
              promoCodeObj.updatedAt = new Date();
              await this.promoCodesRepository.updateById(
                promoCodeObj?.promoId,
                promoCodeObj,
              );
            }
          }
        }

        const createdOrder: ServiceOrders =
          await this.serviceOrdersRepository.create(serviceOrders);

        await this.sendServiceProviderOrderUpdateNotification(createdOrder);

        if (appUser?.endpoint?.length > 20) {
          await this.sendOrderNotification(
            appUser.endpoint,
            'Order Alert',
            'New order has been created.',
            createdOrder,
          );
        }

        result.code = 0;
        result.msg = 'Order created successfully';
        result.order = createdOrder;

        serviceOrders.companyEmail = company.email;
        console.log('Company Email', serviceOrders.companyEmail);

        console.log('Rider', serviceOrders.serviceProviderEmail);
        if (createdOrder.companyEmail) {
          sendCustomMail(
            createdOrder.companyEmail,
            'New Order Assignment By HPU',
            serviceOrders.companyName as string,
            createdOrder.serviceOrderId,
            serviceOrders.serviceName as string,
            'orderCreate',
            undefined,
            serviceOrders.netAmount,
          );
        }

        if (createdOrder.serviceProviderEmail) {
          sendCustomMail(
            createdOrder.serviceProviderEmail,
            `New Order Assignment by ${createdOrder.companyName}`,
            serviceOrders.companyName as string,
            createdOrder.serviceOrderId,
            serviceOrders.serviceName as string,
            'orderCreate',
            undefined,
            serviceOrders.netAmount,
          );
        }
        if (serviceOrders.userEmail) {
          sendCustomMail(
            serviceOrders.userEmail,
            'Order Confirmation',
            serviceOrders.userName,
            createdOrder.serviceOrderId,
            serviceOrders.serviceName as string,
            'orderCreate',
            undefined,
            serviceOrders.netAmount,
          );
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  async getCompany(companyId: string): Promise<Company> {
    let company: Company = new Company();
    if (companyId) {
      company = await this.companyRepository.findById(companyId, {
        fields: ['id', 'email'],
      });
    }
    return company;
  }

  async getServiceProvider(
    serviceProviderId: string,
  ): Promise<ServiceProvider> {
    let serviceProvider: ServiceProvider = new ServiceProvider();
    if (serviceProviderId) {
      serviceProvider = await this.serviceProviderRepository.findById(
        serviceProviderId,
        {fields: ['id', 'email', 'firstName', 'lastName', 'endpoint']},
      );
    }
    return serviceProvider;
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
    serviceOrders.status = 'LO';
    let createdOrder: ServiceOrders = new ServiceOrders();
    const appUser: AppUsers = await this.appUsersRepository.findById(
      serviceOrders.userId,
      {fields: ['id', 'email', 'firstName', 'lastName', 'endpoint']},
    );
    const service: Services = await this.servicesRepository.findById(
      serviceOrders.serviceId,
    );
    if (service && appUser) {
      serviceOrders.userName = appUser.firstName + ' ' + appUser.lastName;
      serviceOrders.userEmail = appUser.email;
      serviceOrders.taxPercentage = service.salesTax;
      serviceOrders.serviceName = service.serviceName;
      serviceOrders.serviceType = service.serviceType;
      serviceOrders.serviceFee = 0;
      if (service.serviceFee) {
        serviceOrders.serviceFee = service.serviceFee;
      }
      if (serviceOrders?.distance) {
        serviceOrders.distanceAmount =
          service.pricePerKm * serviceOrders.distance;
        serviceOrders.grossAmount =
          service.price + serviceOrders.distanceAmount;
      } else {
        serviceOrders.grossAmount = service.price;
      }

      if (!serviceOrders.serviceFeePaid) {
        serviceOrders.grossAmount += serviceOrders.serviceFee;
      }

      if (serviceOrders.taxPercentage) {
        serviceOrders.taxAmount =
          serviceOrders.grossAmount * (serviceOrders.taxPercentage / 100);
      } else {
        serviceOrders.taxAmount = 0;
      }
      serviceOrders.netAmount =
        serviceOrders.grossAmount + serviceOrders.taxAmount;

      createdOrder = await this.serviceOrdersRepository.create(serviceOrders);
      const serviceProviders: ServiceProvider[] =
        await this.serviceProviderRepository.find({
          where: {roleId: 'SERVICEPROVIDER', userStatus: 'A'},
          fields: ['endpoint'],
        });
      if (Array.isArray(serviceProviders) && serviceProviders.length > 0) {
        for (const serviceProvider of serviceProviders) {
          if (serviceProvider?.endpoint?.length > 20) {
            await this.sendOrderNotification(
              serviceProvider.endpoint,
              'Order Alert',
              'A new order is available.',
              createdOrder,
            );
          }
        }
      }
      sendCustomMail(
        serviceOrders.userEmail,
        'Order Confirmation',
        serviceOrders.userName,
        createdOrder.serviceOrderId,
        serviceOrders.serviceName as string,
        'orderCreate',
        undefined,
        createdOrder.netAmount,
      );
    }
    return createdOrder;
  }

  async sendOrderNotification(
    endpoint: string,
    title: string,
    body: string,
    order: ServiceOrders,
  ): Promise<void> {
    await sendMessage({
      notification: {title: title, body: body},
      data: {
        orderId: order.serviceOrderId + '',
        serviceName: order.serviceName + '',
        creationTime: order.createdAt + '',
        serviceType: order.serviceType + '',
        orderStatus: order.status + '',
        price: order.netAmount + '',
        vehicleType: order.vehicleType + '',
        accidental: order.accidental + '',
      },
      token: endpoint,
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
    let result = {
      code: 5,
      msg: 'Some error occurred while updating order.',
      order: {},
    };
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
      serviceOrders.serviceOrderId,
    );
    if (
      (dbOrder?.status &&
        ['UC', 'SC', 'AC'].indexOf(dbOrder?.status) < 0 &&
        serviceOrders &&
        !serviceOrders.status) ||
      (serviceOrders?.status &&
        ['LO', 'CC', 'OA', 'RA', 'AR', 'ST'].indexOf(serviceOrders.status) >= 0)
    ) {
      try {
        await this.populateStatusDates(serviceOrders);
        await this.serviceOrdersRepository.updateById(
          serviceOrders.serviceOrderId,
          serviceOrders,
        );
        dbOrder = await this.serviceOrdersRepository.findById(
          serviceOrders.serviceOrderId,
        );

        await this.sendAppUserOrderUpdateNotification(dbOrder);
        result = {code: 0, msg: 'Order updated successfully.', order: dbOrder};
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
    let result = {
      code: 5,
      msg: 'Some error occurred while completing order.',
      order: {},
      user: {},
    };
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
      orderRequest.serviceOrder.serviceOrderId,
    );
    if (
      dbOrder?.status &&
      'UC,SC,AC'.indexOf(dbOrder?.status) < 0 &&
      orderRequest?.serviceOrder?.status === 'CO' &&
      orderRequest?.serviceOrder?.serviceOrderId
    ) {
      try {
        await this.populateStatusDates(orderRequest.serviceOrder);

        await this.serviceOrdersRepository.updateById(
          orderRequest.serviceOrder.serviceOrderId,
          orderRequest.serviceOrder,
        );
        dbOrder = await this.serviceOrdersRepository.findById(
          orderRequest.serviceOrder.serviceOrderId,
        );
        const appUser: AppUsers[] = await this.appUsersRepository.find({
          where: {roleId: 'APPUSER', id: dbOrder.userId},
        });
        await this.sendAppUserOrderUpdateNotification(dbOrder);
        result = {
          code: 0,
          msg: 'Order completed successfully.',
          order: dbOrder,
          user: appUser,
        };
      } catch (e) {
        console.log(e);
        result.code = 5;
        result.msg = e.message;
      }
    }
    return JSON.stringify(result);
  }

  @post('/serviceOrders/adminUser/completeOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async adminCompleteOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OrderRequest, {partial: true}),
        },
      },
    })
    orderRequest: OrderRequest,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occurred while completing order.',
      order: {},
    };
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
      orderRequest.serviceOrder.serviceOrderId,
    );
    if (
      dbOrder?.status &&
      ['UC', 'SC', 'AC'].indexOf(dbOrder?.status) === -1 &&
      orderRequest?.serviceOrder?.status === 'CO' &&
      orderRequest?.serviceOrder?.serviceOrderId
    ) {
      try {
        await this.populateStatusDates(orderRequest.serviceOrder);

        await this.serviceOrdersRepository.updateById(
          orderRequest.serviceOrder.serviceOrderId,
          orderRequest.serviceOrder,
        );
        dbOrder = await this.serviceOrdersRepository.findById(
          orderRequest.serviceOrder.serviceOrderId,
        );
        await this.sendAppUserOrderUpdateNotification(dbOrder);
        await this.sendServiceProviderOrderUpdateNotification(dbOrder);

        result = {
          code: 0,
          msg: 'Order completed successfully.',
          order: dbOrder,
        };
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
    let result = {
      code: 5,
      msg: 'Some error occurred while initiating payment.',
      order: {},
    };
    if (
      orderRequest?.serviceOrder?.serviceOrderId &&
      (orderRequest?.serviceOrder?.paymentMethod === 'CASH' ||
        orderRequest?.serviceOrder?.paymentMethod === 'CARD')
    ) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        orderRequest?.serviceOrder?.serviceOrderId,
      );
      if (
        dbOrder &&
        dbOrder.status === 'CO' &&
        orderRequest?.serviceOrder?.status === 'PI'
      ) {
        try {
          orderRequest.payment.payerId = dbOrder.userId;
          orderRequest.payment.receiverId = dbOrder.serviceProviderId;
          orderRequest.payment.paymentOrderId = dbOrder.serviceOrderId;
          orderRequest.payment.paymentStatus = 'L';
          await this.paymentRepository.create(orderRequest.payment);
          await this.populateStatusDates(orderRequest.serviceOrder);
          const serviceProviderAccount: Account =
            await this.serviceProviderRepository
              .account(dbOrder.serviceProviderId)
              .get({});
          let balanceAmount = 0;
          if (orderRequest?.serviceOrder?.paymentMethod === 'CARD') {
            balanceAmount =
              serviceProviderAccount.balanceAmount + dbOrder.netAmount * 0.9;
          } else if (orderRequest?.serviceOrder?.paymentMethod === 'CASH') {
            balanceAmount =
              serviceProviderAccount.balanceAmount - dbOrder.netAmount * 0.1;
          }
          await this.serviceProviderRepository
            .account(dbOrder.serviceProviderId)
            .patch({balanceAmount: balanceAmount}, {});
          await this.serviceOrdersRepository.updateById(
            orderRequest.serviceOrder.serviceOrderId,
            orderRequest.serviceOrder,
          );
          if (dbOrder?.promoId && dbOrder.orderType === 'U') {
            const promoCodeObj: PromoCodes =
              await this.promoCodesRepository.findById(dbOrder.promoId, {});
            if (promoCodeObj) {
              promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
              promoCodeObj.updatedAt = new Date();
              await this.promoCodesRepository.updateById(
                dbOrder.promoId,
                promoCodeObj,
              );
            }
          }

          dbOrder = await this.serviceOrdersRepository.findById(
            orderRequest?.serviceOrder?.serviceOrderId,
          );

          await this.sendServiceProviderOrderUpdateNotification(dbOrder);

          result = {
            code: 0,
            msg: 'Payment initiated successfully.',
            order: dbOrder,
          };
        } catch (e) {
          console.log(e);
          result.code = 5;
          result.msg = e.message;
        }
      }
    }
    return JSON.stringify(result);
  }

  async processTransactionResponse(
    transactionResponse: TransactionResponse,
    serviceOrderId: string,
  ): Promise<void> {
    const transaction: Transaction = new Transaction();
    transaction.serviceOrderId = serviceOrderId;
    transaction.transactionProcessedDateTime =
      transactionResponse.txndate_processed;
    transaction.cardBin = transactionResponse.ccbin;
    transaction.timezone = transactionResponse.timezone;
    transaction.processorNetworkInformation =
      transactionResponse.processor_network_information;
    transaction.oid = transactionResponse.oid;
    transaction.country = transactionResponse.cccountry;
    transaction.expiryMonth = transactionResponse.expmonth;
    transaction.hashAlgorithm = transactionResponse.hash_algorithm;
    transaction.endpointTransactionId =
      transactionResponse.endpointTransactionId;
    transaction.currency = transactionResponse.currency;
    transaction.processorResponseCode =
      transactionResponse.processor_response_code;
    transaction.chargeTotal = transactionResponse.chargetotal;
    transaction.terminalId = transactionResponse.terminal_id;
    transaction.associationResponseCode =
      transactionResponse.associationResponseCode;
    transaction.approvalCode = transactionResponse.approval_code;
    transaction.expiryYear = transactionResponse.expyear;
    transaction.responseHash = transactionResponse.response_hash;
    transaction.transactionDateInSeconds = transactionResponse.tdate;
    transaction.installmentsInterest =
      transactionResponse.installments_interest;
    transaction.bankName = transactionResponse.bname;
    transaction.CardBrand = transactionResponse.ccbrand;
    transaction.referenceNumber = transactionResponse.refnumber;
    transaction.transactionType = transactionResponse.txntype;
    transaction.paymentMethod = transactionResponse.paymentMethod;
    transaction.transactionDateTime = transactionResponse.txndatetime;
    transaction.cardNumber = transactionResponse.cardnumber;
    transaction.ipgTransactionId = transactionResponse.ipgTransactionId;
    transaction.status = transactionResponse.status;

    await this.transactionRepository.create(transaction);
  }

  @post('/serviceOrders/appUser/processCardPayment/failure/{serviceOrderId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async processCardPaymentFailure(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionResponse, {partial: true}),
        },
      },
    })
    transactionResponse: TransactionResponse,
    @param.path.string('serviceOrderId') serviceOrderId: string,
  ): Promise<string> {
    const result = {code: 5, msg: 'Payment failed.', order: {}};
    if (serviceOrderId) {
      const dbOrder: ServiceOrders =
        await this.serviceOrdersRepository.findById(serviceOrderId);
      await this.processTransactionResponse(
        transactionResponse,
        dbOrder.serviceOrderId,
      );
      result.order = dbOrder;
    }
    return JSON.stringify(result);
  }

  @post('/serviceOrders/appUser/processCardPayment/success/{serviceOrderId}')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async processCardPaymentSuccess(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TransactionResponse, {partial: true}),
        },
      },
    })
    transactionResponse: TransactionResponse,
    @param.path.string('serviceOrderId') serviceOrderId: string,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occurred while completing payment.',
      order: {},
    };
    if (serviceOrderId) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        serviceOrderId,
      );
      await this.processTransactionResponse(
        transactionResponse,
        dbOrder.serviceOrderId,
      );
      if (
        dbOrder?.status === 'CO' &&
        transactionResponse?.status === 'APPROVED'
      ) {
        try {
          const paymentObj: Payment = new Payment();
          paymentObj.payerId = dbOrder.userId;
          paymentObj.paymentOrderId = dbOrder.serviceOrderId;
          paymentObj.receiverId = dbOrder.serviceProviderId;
          paymentObj.paymentType = 'CARD';
          paymentObj.paymentAmount = dbOrder.netAmount;
          paymentObj.paymentStatus = 'C';
          await this.paymentRepository.create(paymentObj);
          dbOrder.paymentType = paymentObj.paymentType;
          dbOrder.status = 'PC';
          await this.populateStatusDates(dbOrder);
          await this.serviceOrdersRepository.updateById(
            serviceOrderId,
            dbOrder,
          );
          dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);

          const serviceProviderAccount: Account =
            await this.serviceProviderRepository
              .account(dbOrder.serviceProviderId)
              .get({});
          const balanceAmount =
            serviceProviderAccount.balanceAmount + dbOrder.netAmount * 0.9;

          await this.serviceProviderRepository
            .account(dbOrder.serviceProviderId)
            .patch({balanceAmount: balanceAmount}, {});
          if (dbOrder.promoId && dbOrder.orderType === 'U') {
            const promoCodeObj: PromoCodes =
              await this.promoCodesRepository.findById(dbOrder.promoId, {});
            if (promoCodeObj) {
              promoCodeObj.totalUsed = promoCodeObj.totalUsed + 1;
              promoCodeObj.updatedAt = new Date();
              await this.promoCodesRepository.updateById(
                dbOrder.promoId,
                promoCodeObj,
              );
            }
          }

          dbOrder = await this.serviceOrdersRepository.findById(serviceOrderId);
          const serviceProvider: ServiceProvider =
            await this.serviceProviderRepository.findById(
              dbOrder.serviceProviderId,
              {fields: ['endpoint']},
            );

          if (serviceProvider?.endpoint?.length > 20) {
            await this.sendOrderNotification(
              serviceProvider.endpoint,
              'Order Alert',
              'Payment has been completed.',
              dbOrder,
            );
          }

          const appUser: AppUsers = await this.appUsersRepository.findById(
            dbOrder.userId,
            {fields: ['endpoint']},
          );

          if (appUser?.endpoint?.length > 20) {
            await this.sendOrderNotification(
              appUser.endpoint,
              'Order Alert',
              'Payment has been completed.',
              dbOrder,
            );
          }

          result = {
            code: 0,
            msg: 'Payment completed successfully.',
            order: dbOrder,
          };
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
    let result = {
      code: 5,
      msg: 'Some error occurred while completing payment.',
      order: {},
    };
    if (orderRequest?.serviceOrder?.serviceOrderId) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        orderRequest?.serviceOrder?.serviceOrderId,
      );
      if (
        dbOrder &&
        dbOrder.status === 'PI' &&
        orderRequest?.serviceOrder?.status === 'PC'
      ) {
        try {
          await this.populateStatusDates(orderRequest.serviceOrder);

          const paymentObj: Payment | null =
            await this.paymentRepository.findOne({
              where: {paymentOrderId: orderRequest.serviceOrder.serviceOrderId},
            });
          if (paymentObj) {
            paymentObj.paymentStatus = 'C';
            await this.paymentRepository.updateById(
              paymentObj.paymentId,
              paymentObj,
            );
            await this.serviceOrdersRepository.updateById(
              orderRequest.serviceOrder.serviceOrderId,
              orderRequest.serviceOrder,
            );
            dbOrder = await this.serviceOrdersRepository.findById(
              orderRequest?.serviceOrder?.serviceOrderId,
            );
            await this.sendAppUserOrderUpdateNotification(dbOrder);

            result = {
              code: 0,
              msg: 'Payment completed successfully.',
              order: dbOrder,
            };
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

  async sendAppUserOrderUpdateNotification(
    serviceOrders: ServiceOrders,
  ): Promise<void> {
    let title = '',
      body = '';
    if (serviceOrders?.userId) {
      const appUser: AppUsers = await this.appUsersRepository.findById(
        serviceOrders.userId,
        {fields: ['endpoint']},
      );
      if (serviceOrders?.status && appUser?.endpoint?.length > 20) {
        if (serviceOrders?.status === 'OA') {
          title = 'Order Accepted';
          body = 'Your Order has been accepted.';
        } else if (serviceOrders?.status === 'AR') {
          title = 'Service Provider Arrived';
          body = 'Service Provider has arrived at your location.';
        } else if (serviceOrders?.status === 'RA') {
          title = 'Rider is arriving';
          body = 'Service Provider is arriving at your location.';
        } else if (serviceOrders?.status === 'CC') {
          title = 'Time has been confirmed.';
          body = 'Rider has confirmed the time.';
        } else if (serviceOrders?.status === 'ST') {
          title = 'Order Started';
          body = 'Your order has started.';
        } else if (serviceOrders?.status === 'CO') {
          title = 'Order Completed';
          body = 'Your order has been completed.';
        } else if (serviceOrders?.status === 'PC') {
          title = 'Payment Completed';
          body = 'Your payment has been completed.';
        } else if (serviceOrders?.status === 'SC') {
          title = 'Order Canceled';
          body = 'Order has been canceled by the service provider.';
        } else if (serviceOrders?.status === 'AC') {
          title = 'Order Canceled By Admin';
          body = 'Order has been canceled by the admin.';
        }

        await this.sendOrderNotification(
          appUser.endpoint,
          title,
          body,
          serviceOrders,
        );
      }

      sendCustomMail(
        serviceOrders.userEmail,
        'Order Confirmation',
        serviceOrders.userName,
        serviceOrders.serviceOrderId,
        serviceOrders.orderType as string,
        'orderCreate',
      );
    }
  }

  async sendServiceProviderOrderUpdateNotification(
    serviceOrders: ServiceOrders,
  ): Promise<void> {
    let title = '',
      body = '';
    if (serviceOrders?.serviceProviderId) {
      const serviceProvider: ServiceProvider =
        await this.serviceProviderRepository.findById(
          serviceOrders.serviceProviderId,
          {fields: ['endpoint']},
        );
      if (serviceOrders?.status && serviceProvider?.endpoint?.length > 20) {
        if (serviceOrders?.status === 'LO' || serviceOrders?.status === 'OA') {
          title = 'Order Alert';
          body = 'New order has been assigned.';
        } else if (serviceOrders?.status === 'CO') {
          title = 'Order Completed';
          body = 'Order has been completed.';
        } else if (serviceOrders?.status === 'PC') {
          title = 'Payment Completed';
          body = 'Your payment has been completed.';
        } else if (serviceOrders?.status === 'PI') {
          title = 'Payment Initiated';
          body = 'Payment has been initiated.';
        } else if (serviceOrders?.status === 'UC') {
          title = 'Order Canceled';
          body = 'Order has been canceled by the user.';
        } else if (serviceOrders?.status === 'AC') {
          title = 'Order Canceled By Admin';
          body = 'Order has been canceled by the admin.';
        }

        await this.sendOrderNotification(
          serviceProvider.endpoint,
          title,
          body,
          serviceOrders,
        );
      }
    }
  }

  async populateStatusDates(serviceOrders: ServiceOrders): Promise<void> {
    const currentDateTime = new Date();
    if (serviceOrders) {
      if (serviceOrders.status === 'OA') {
        serviceOrders.acceptedAt = currentDateTime;
      } else if (serviceOrders.status === 'AR') {
        serviceOrders.arrivedAt = currentDateTime;
      } else if (serviceOrders.status === 'CC') {
        serviceOrders.confirmedAt = currentDateTime;
      } else if (serviceOrders.status === 'ST') {
        serviceOrders.startedAt = currentDateTime;
      } else if (serviceOrders.status === 'PC') {
        serviceOrders.payedAt = currentDateTime;
      } else if (serviceOrders?.status === 'CO') {
        serviceOrders.completedAt = currentDateTime;
      }
    }
    serviceOrders.updatedAt = currentDateTime;
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
    let result = {
      code: 5,
      msg: 'Some error occurred while rating order.',
      order: {},
    };
    if (serviceOrder?.rating && serviceOrder?.serviceOrderId) {
      try {
        serviceOrder.updatedAt = new Date();

        await this.serviceOrdersRepository.updateById(
          serviceOrder.serviceOrderId,
          serviceOrder,
        );
        const dbOrder: ServiceOrders =
          await this.serviceOrdersRepository.findById(
            serviceOrder.serviceOrderId,
          );

        const serviceProviderOrders: ServiceOrders[] =
          await this.serviceOrdersRepository.find({
            where: {
              serviceProviderId: dbOrder.serviceProviderId,
              rating: {gt: 0},
            },
          });
        let serviceProviderRating = 0;
        if (serviceProviderOrders?.length > 0) {
          let totalRating = 0;
          serviceProviderOrders.forEach(order => {
            if (order?.rating) {
              totalRating += order.rating;
            }
          });
          serviceProviderRating = totalRating / serviceProviderOrders.length;
        }

        await this.serviceProviderRepository.updateById(
          dbOrder.serviceProviderId,
          {rating: serviceProviderRating},
        );

        //await this.sendOrderUpdateNotification(dbOrder);
        result = {code: 0, msg: 'Order rated successfully.', order: dbOrder};
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
    let result = {
      code: 5,
      msg: 'Some error occurred while canceling order.',
      order: {},
    };
    if (serviceOrders?.serviceOrderId) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        serviceOrders.serviceOrderId,
      );

      if (
        dbOrder?.status &&
        'OA,CC,AR,ST'.indexOf(dbOrder?.status) >= 0 &&
        serviceOrders?.status &&
        'SC'.indexOf(serviceOrders.status) >= 0 &&
        dbOrder.serviceProviderId + '' === serviceOrders.serviceProviderId + ''
      ) {
        try {
          await this.populateStatusDates(serviceOrders);
          await this.serviceOrdersRepository.updateById(
            serviceOrders.serviceOrderId,
            serviceOrders,
          );
          dbOrder = await this.serviceOrdersRepository.findById(
            serviceOrders.serviceOrderId,
          );

          if (dbOrder?.userId) {
            await this.sendAppUserOrderUpdateNotification(dbOrder);
          }

          result = {code: 0, msg: 'Order canceled.', order: dbOrder};
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
    let result = {
      code: 5,
      msg: 'Some error occurred while canceling order.',
      order: {},
    };
    if (serviceOrders?.serviceOrderId) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        serviceOrders.serviceOrderId,
      );
      if (
        dbOrder?.status &&
        ['LO', 'CC', 'OA', 'RA', 'AR'].indexOf(dbOrder?.status) >= 0 &&
        serviceOrders?.status &&
        'UC'.indexOf(serviceOrders.status) >= 0
      ) {
        try {
          await this.populateStatusDates(serviceOrders);
          await this.serviceOrdersRepository.updateById(
            serviceOrders.serviceOrderId,
            serviceOrders,
          );
          dbOrder = await this.serviceOrdersRepository.findById(
            serviceOrders.serviceOrderId,
          );
          if (dbOrder?.serviceProviderId) {
            await this.sendServiceProviderOrderUpdateNotification(dbOrder);
          }

          result = {code: 0, msg: 'Order canceled.', order: dbOrder};
        } catch (e) {
          console.log(e);
          result.code = 5;
          result.msg = e.message;
        }
      }
    }
    return JSON.stringify(result);
  }

  @post('/serviceOrders/adminUser/cancelOrder')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(ServiceOrders)}},
  })
  async adminUserCancelOrder(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ServiceOrders, {partial: true}),
        },
      },
    })
    serviceOrders: ServiceOrders,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occurred while canceling order.',
      order: {},
    };
    if (serviceOrders?.serviceOrderId) {
      let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
        serviceOrders.serviceOrderId,
      );
      if (
        dbOrder?.status &&
        ['LO', 'CC', 'OA', 'RA', 'AR'].indexOf(dbOrder?.status) >= 0 &&
        serviceOrders?.status === 'AC'
      ) {
        try {
          await this.populateStatusDates(serviceOrders);
          await this.serviceOrdersRepository.updateById(
            serviceOrders.serviceOrderId,
            serviceOrders,
          );
          dbOrder = await this.serviceOrdersRepository.findById(
            serviceOrders.serviceOrderId,
          );
          if (dbOrder?.serviceProviderId) {
            await this.sendServiceProviderOrderUpdateNotification(dbOrder);
          }
          if (dbOrder?.userId) {
            await this.sendAppUserOrderUpdateNotification(dbOrder);
          }
          result = {code: 0, msg: 'Order canceled.', order: dbOrder};
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
    let result = {
      code: 5,
      msg: 'Some error occurred while applying promo code.',
      order: {},
    };
    let dbOrder: ServiceOrders = await this.serviceOrdersRepository.findById(
      serviceOrders.serviceOrderId,
    );

    const promoCodeObj: PromoCodes | null =
      await this.promoCodesRepository.findOne({
        where: {promoCode: serviceOrders.promoCode},
      });
    if (promoCodeObj && dbOrder) {
      try {
        const userOrdersWithPromoCode: ServiceOrders[] =
          await this.serviceOrdersRepository.find({
            where: {userId: dbOrder.userId, promoCode: serviceOrders.promoCode},
            fields: ['serviceOrderId'],
          });
        if (
          promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
          userOrdersWithPromoCode &&
          userOrdersWithPromoCode.length < promoCodeObj.userLimit
        ) {
          let promoDiscount = 0;
          if (promoCodeObj.discountType === 'R') {
            if (promoCodeObj.discountValue < dbOrder.grossAmount) {
              promoDiscount = promoCodeObj.discountValue;
            } else {
              promoDiscount = dbOrder.grossAmount;
            }
          } else if (promoCodeObj.discountType === 'P') {
            promoDiscount =
              dbOrder.grossAmount * (promoCodeObj.discountValue / 100);
          }
          dbOrder.discountAmount = promoDiscount;
          dbOrder.promoCode = promoCodeObj.promoCode;
          dbOrder.promoId = promoCodeObj.promoId;
          dbOrder.discountType = promoCodeObj.discountType;
          dbOrder.discountValue = promoCodeObj.discountValue;

          if (!serviceOrders.serviceFeePaid) {
            serviceOrders.grossAmount += serviceOrders.serviceFee;
          }
          if (dbOrder.taxPercentage) {
            dbOrder.taxAmount =
              (dbOrder.grossAmount - promoDiscount) *
              (dbOrder.taxPercentage / 100);
          } else {
            dbOrder.taxAmount = 0;
          }
          dbOrder.netAmount =
            dbOrder.grossAmount - promoDiscount + dbOrder.taxAmount;
          dbOrder.updatedAt = new Date();
          await this.serviceOrdersRepository.updateById(
            dbOrder.serviceOrderId,
            dbOrder,
          );
          dbOrder = await this.serviceOrdersRepository.findById(
            dbOrder.serviceOrderId,
          );

          if (dbOrder?.serviceProviderId) {
            const serviceProvider: ServiceProvider =
              await this.serviceProviderRepository.findById(
                dbOrder.serviceProviderId,
                {fields: ['endpoint']},
              );
            if (serviceProvider?.endpoint?.length > 20) {
              await this.sendOrderNotification(
                serviceProvider.endpoint,
                'Order Alert',
                'A promo code has been applied by the user.',
                dbOrder,
              );
            }
          }

          result = {
            code: 0,
            msg: 'Promo code applied successfully.',
            order: dbOrder,
          };
        } else if (promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
          result.msg = 'Coupon has reached its limit.';
        } else if (
          userOrdersWithPromoCode &&
          userOrdersWithPromoCode.length < promoCodeObj.userLimit
        ) {
          result.msg = 'User has reached this coupons limit.';
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
    let result = {
      code: 5,
      msg: 'Some error occurred while getting promo info.',
      order: {},
    };
    if (
      serviceOrders?.serviceId &&
      serviceOrders?.promoCode &&
      serviceOrders?.userId
    ) {
      const promoCodeObj: PromoCodes | null =
        await this.promoCodesRepository.findOne({
          where: {promoCode: serviceOrders.promoCode},
        });
      const service: Services = await this.servicesRepository.findById(
        serviceOrders.serviceId,
      );
      if (promoCodeObj && service) {
        try {
          const userOrdersWithPromoCode: ServiceOrders[] =
            await this.serviceOrdersRepository.find({
              where: {
                userId: serviceOrders.userId,
                promoCode: serviceOrders.promoCode,
              },
              fields: ['serviceOrderId'],
            });
          if (
            promoCodeObj.totalUsed < promoCodeObj.totalLimit &&
            userOrdersWithPromoCode &&
            userOrdersWithPromoCode.length < promoCodeObj.userLimit
          ) {
            let promoDiscount = 0;
            if (promoCodeObj.discountType === 'R') {
              if (promoCodeObj.discountValue < service.price) {
                promoDiscount = promoCodeObj.discountValue;
              } else {
                promoDiscount = service.price;
              }
            } else if (promoCodeObj.discountType === 'P') {
              promoDiscount =
                service.price * (promoCodeObj.discountValue / 100);
            }
            serviceOrders.discountAmount = promoDiscount;
            serviceOrders.promoCode = promoCodeObj.promoCode;
            serviceOrders.promoId = promoCodeObj.promoId;
            serviceOrders.discountType = promoCodeObj.discountType;
            serviceOrders.discountValue = promoCodeObj.discountValue;
            serviceOrders.netAmount = service.price - promoDiscount;

            result = {
              code: 0,
              msg: 'Promo code applied successfully.',
              order: serviceOrders,
            };
          } else if (promoCodeObj.totalUsed < promoCodeObj.totalLimit) {
            result.msg = 'Coupon has reached its limit.';
          } else if (
            userOrdersWithPromoCode &&
            userOrdersWithPromoCode.length < promoCodeObj.userLimit
          ) {
            result.msg = 'User has reached this coupons limit.';
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

  @authenticate('jwt')
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
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<Object> {
    let result = {
      code: 5,
      msg: 'Some error occurred while getting orders.',
      orders: {},
    };
    try {
      if (filter) {
        filter.where = {...filter.where, serviceProviderId: serviceProviderId};
      } else {
        filter = {where: {serviceProviderId: serviceProviderId}};
      }

      if (serviceProviderId && serviceProviderId.length > 0) {
        const orders: ServiceOrders[] = await this.serviceOrdersRepository.find(
          filter,
        );
        result = {code: 0, msg: 'Orders fetched successfully.', orders: orders};
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
  async getAllOrdersForAdmin(
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<Object> {
    let result = {
      code: 5,
      msg: 'Some error occurred while getting orders.',
      orders: {},
    };
    try {
      const orders: ServiceOrders[] = await this.serviceOrdersRepository.find(
        filter,
      );
      if (orders?.length > 0) {
        for (const order of orders) {
          try {
            if (order.serviceProviderId) {
              order.serviceProvider =
                await this.serviceProviderRepository.findById(
                  order.serviceProviderId,
                );
            }
          } catch (e) {
            console.log(e);
          }
        }
      }

      result = {code: 0, msg: 'Orders fetched successfully.', orders: orders};
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
  async getOrderDetailsForAdmin(
    @param.path.string('serviceOrderId') serviceOrderId: string,
  ): Promise<Object> {
    let result = {
      code: 5,
      msg: 'Some error occurred while getting order.',
      order: {},
    };
    try {
      const order: ServiceOrders = await this.serviceOrdersRepository.findById(
        serviceOrderId,
      );
      result = {code: 0, msg: 'Order fetched successfully.', order: order};
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
    await sendMessage({
      notification: {
        title: 'Test Notification ',
        body: 'This is a sample test msg.',
      },
      data: {},
      token: token,
    });
    return 'SUCCESS';
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

  @get(
    '/serviceOrders/serviceProvider/getServiceOrderDetails/{serviceOrderId}/{serviceProviderId}',
  )
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
    let result = {
      code: 5,
      msg: 'Some error occurred while getting orders.',
      orders: {},
    };
    try {
      if (serviceProviderId?.length > 0 && serviceOrderId?.length > 0) {
        const dbServiceOrders: ServiceOrders[] =
          await this.serviceOrdersRepository.find({
            where: {
              serviceOrderId: serviceOrderId,
              serviceProviderId: serviceProviderId,
            },
          });
        if (dbServiceOrders && dbServiceOrders.length > 0) {
          result = {
            code: 0,
            msg: 'Orders fetched successfully.',
            orders: dbServiceOrders,
          };
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @get(
    '/serviceOrders/appUser/getServiceOrderDetails/{serviceOrderId}/{appUserId}',
  )
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
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occurred while getting order details.',
      orders: {},
      serviceProvider: {},
    };
    try {
      if (appUserId?.length > 0 && serviceOrderId?.length > 0) {
        if (filter) {
          filter.where = {
            ...filter.where,
            serviceOrderId: serviceOrderId,
            userId: appUserId,
          };
        } else {
          filter = {
            where: {
              serviceOrderId: serviceOrderId,
              userId: appUserId,
            },
          };
        }
        const dbServiceOrders: ServiceOrders[] =
          await this.serviceOrdersRepository.find(filter);
        if (dbServiceOrders?.length > 0) {
          let serviceProvider = {};
          if (dbServiceOrders[0]?.serviceProviderId) {
            serviceProvider = await this.serviceProviderRepository.findById(
              dbServiceOrders[0].serviceProviderId,
            );
          }
          result = {
            code: 0,
            msg: 'Orders fetched successfully.',
            orders: dbServiceOrders[0],
            serviceProvider: serviceProvider,
          };
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
    @param.filter(ServiceOrders) filter?: Filter<ServiceOrders>,
  ): Promise<string> {
    let result = {
      code: 5,
      msg: 'Some error occurred while getting orders.',
      orders: {},
    };
    try {
      if (appUserId?.length > 0) {
        if (filter) {
          filter.where = {...filter.where, userId: appUserId};
        } else {
          filter = {where: {userId: appUserId}};
        }
        const dbServiceOrders: ServiceOrders[] =
          await this.serviceOrdersRepository.find(filter);
        if (dbServiceOrders && dbServiceOrders.length > 0) {
          result = {
            code: 0,
            msg: 'Orders fetched successfully.',
            orders: dbServiceOrders,
          };
        }
      }
    } catch (e) {
      console.log(e);
      result.code = 5;
      result.msg = e.message;
    }
    return JSON.stringify(result);
  }

  @get('/serviceOrders/getCurrentOrder/{userType}/{userId}/{orderType}')
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
    @param.path.string('orderType') orderType: string,
  ): Promise<string> {
    const result = {code: 0, msg: 'Order fetched successfully.', order: {}};
    let dbServiceOrders: ServiceOrders[] = [];
    const requiredServiceIdArray: string[] = [];
    if (orderType?.toUpperCase() === 'DFY') {
      requiredServiceIdArray.push('Done For You');
    } else {
      requiredServiceIdArray.push('General Assistance');
      requiredServiceIdArray.push('Car Tow');
    }
    const serviceArray: Services[] = await this.servicesRepository.find({
      where: {serviceType: {inq: requiredServiceIdArray}},
      fields: ['serviceId'],
    });
    const serviceIdArray = serviceArray.map(service => service.serviceId);

    if (userType === 'U') {
      dbServiceOrders = await this.serviceOrdersRepository.find({
        where: {
          userId: userId,
          serviceId: {inq: serviceIdArray},
          status: {inq: ['LO', 'CC', 'OA', 'RA', 'AR', 'ST', 'CO', 'PI']},
        },
      });
    } else if (userType === 'S') {
      dbServiceOrders = await this.serviceOrdersRepository.find({
        where: {
          serviceProviderId: userId,
          serviceId: {inq: serviceIdArray},
          status: {inq: ['OA', 'CC', 'RA', 'AR', 'ST', 'CO', 'PI']},
        },
      });
    }

    result.order = dbServiceOrders;

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
