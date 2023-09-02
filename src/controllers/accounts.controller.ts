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
import {Account, ServiceOrders, WithdrawalRequest} from '../models';
import {
  AccountRepository,
  ServiceOrdersRepository,
  ServiceProviderRepository,
} from '../repositories';

export class AccountsController {
  constructor(
    @repository(AccountRepository)
    public accountRepository: AccountRepository,
    @repository(ServiceOrdersRepository)
    public serviceOrdersRepository: ServiceOrdersRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @post('/accounts')
  @response(200, {
    description: 'Account model instance',
    content: {'application/json': {schema: getModelSchemaRef(Account)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {
            title: 'NewAccount',
            exclude: ['accountId'],
          }),
        },
      },
    })
    account: Omit<Account, 'accountId'>,
  ): Promise<Account> {
    return this.accountRepository.create(account);
  }

  @get('/accounts/count')
  @response(200, {
    description: 'Account model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Account) where?: Where<Account>): Promise<Count> {
    return  this.accountRepository.count(where);
  }

  @get('/accounts')
  @response(200, {
    description: 'Array of Account model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Account, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Account) filter?: Filter<Account>,
  ): Promise<Account[]> {
    return this.accountRepository.find(filter);
  }

  @get('/accounts/serviceProvider/getAccountInfo/{serviceProviderId}')
  @response(200, {
    description: 'Array of Account model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Account, {includeRelations: true}),
        },
      },
    },
  })
  async getAccountInfo(
    @param.path.string('serviceProviderId') serviceProviderId: string,
  ): Promise<string> {
    const result = {
      code: 5,
      msg: 'No record found.',
      account: {},
      withdrawalRequests: {},
      totalWithdrawanAmount: 0,
      totalEarnedAmmount: 0,
    };
    const account: Account = await this.serviceProviderRepository
      .account(serviceProviderId)
      .get({});
    if (account?.accountId) {
      const last5WithdrawalRequests: WithdrawalRequest[] =
        await this.accountRepository
          .withdrawalRequests(account.accountId)
          .find({limit: 5, order: ['createdAt desc']});
      const allWithdrawalRequests4Sum: WithdrawalRequest[] =
        await this.accountRepository
          .withdrawalRequests(account.accountId)
          .find({where: {status: 'C'}, fields: ['withdrawalAmount']});
      let totalWithdrawanAmount = 0;
      if (allWithdrawalRequests4Sum?.length > 0) {
        allWithdrawalRequests4Sum.forEach(withdrawalRequest => {
          if (withdrawalRequest?.withdrawalAmount) {
            totalWithdrawanAmount += withdrawalRequest.withdrawalAmount;
          }
        });
      }

      let totalEarnedAmmount = 0;
      const orders: ServiceOrders[] = await this.serviceOrdersRepository.find({
        where: {serviceProviderId: serviceProviderId, status: 'PC'},
      });
      orders.forEach(order => {
        if (order?.netAmount) {
          totalEarnedAmmount += order.netAmount;
        }
      });
      result.code = 0;
      result.account = account;
      result.withdrawalRequests = last5WithdrawalRequests;
      result.totalWithdrawanAmount = totalWithdrawanAmount;
      result.totalEarnedAmmount = totalEarnedAmmount;
    }

    return JSON.stringify(result);
  }

  @patch('/accounts')
  @response(200, {
    description: 'Account PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Account,
    @param.where(Account) where?: Where<Account>,
  ): Promise<Count> {
    return this.accountRepository.updateAll(account, where);
  }

  @get('/accounts/{id}')
  @response(200, {
    description: 'Account model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Account, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Account, {exclude: 'where'})
    filter?: FilterExcludingWhere<Account>,
  ): Promise<Account> {
    return this.accountRepository.findById(id, filter);
  }

  @patch('/accounts/{id}')
  @response(204, {
    description: 'Account PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Account, {partial: true}),
        },
      },
    })
    account: Account,
  ): Promise<void> {
    await this.accountRepository.updateById(id, account);
  }

  @put('/accounts/{id}')
  @response(204, {
    description: 'Account PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() account: Account,
  ): Promise<void> {
    await this.accountRepository.replaceById(id, account);
  }

  @del('/accounts/{id}')
  @response(204, {
    description: 'Account DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.accountRepository.deleteById(id);
  }
}
