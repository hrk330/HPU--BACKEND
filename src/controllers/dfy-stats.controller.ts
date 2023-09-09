import {getModelSchemaRef, get, response} from '@loopback/rest';
import { OrderRequest, Payment, RevenueStats, ServiceOrders} from '../models';
import {repository} from '@loopback/repository';
import {
  AppUsersRepository,
  PaymentRepository,
  PromoCodesRepository,
  ServiceOrdersRepository, ServiceProviderRepository,
  ServicesRepository, TransactionRepository,
} from '../repositories';

export class DfyStatsController {
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
  ) {}

  @get('/dfy/getDashboardStats')
  @response(200, {
    description: 'ServiceOrders model instance',
    content: {'application/json': {schema: getModelSchemaRef(OrderRequest)}},
  })
  async initiatePayment(): Promise<string> {
    const revenueStats: RevenueStats = new RevenueStats();
    const result = {
      code: 5,
      msg: 'Some error occurred while initiating payment.',
      dfyStats: {},
    };
    try {
      const dbOrders: ServiceOrders[] = await this.serviceOrdersRepository.find({where: {serviceType: "Done For You"}});
      const paymentOrderIds: string[] = dbOrders.map(dbOrder => dbOrder.serviceOrderId);
      const dfyPayments: Payment[] = await this.paymentRepository.find({where: {paymentStatus: 'C', paymentOrderId: {inq: paymentOrderIds}}});
      revenueStats.revenue = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.paymentAmount, 0);
      revenueStats.earning = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.platformFee, 0);
      revenueStats.coffer = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.paymentAmount, 0);
      revenueStats.outstandingCash = dfyPayments.reduce((accumulator, dfyPayment) => accumulator + dfyPayment.platformFee, 0);

      result.dfyStats = revenueStats;
      result.code = 0;
      result.msg = 'Stats fetched successfully.';
    } catch (e) {
      console.log(e)
    }
    return JSON.stringify(result);
  }
}
