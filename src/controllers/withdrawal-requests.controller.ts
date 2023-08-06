import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  requestBody,
  response,
} from '@loopback/rest';
import {Account, WithdrawalRequest} from '../models';
import {ServiceProviderRepository, WithdrawalRequestRepository} from '../repositories';

export class WithdrawalRequestsController {
  constructor(
    @repository(WithdrawalRequestRepository)
    public withdrawalRequestRepository : WithdrawalRequestRepository,
    @repository(ServiceProviderRepository)
    public serviceProviderRepository: ServiceProviderRepository,
  ) {}

  @post('/withdrawalRequests/createWithdrawalRequest')
  @response(200, {
    description: 'WithdrawalRequest model instance',
    content: {'application/json': {schema: getModelSchemaRef(WithdrawalRequest)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {
            title: 'NewWithdrawalRequest',
            exclude: ['withdrawlRequestId'],
          }),
        },
      },
    })
    withdrawalRequest: Omit<WithdrawalRequest, 'withdrawlRequestId'>,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while creating withdrawal request.", withdrawalRequest: {}};
	  try{
		  const userAccount: Account = await this.serviceProviderRepository.account(withdrawalRequest.serviceProviderId).get({})
		  if(!withdrawalRequest?.withdrawalAmount || withdrawalRequest?.withdrawalAmount < 1200) {
		  	result.msg = "Withdrawal amount should be greater than 1200.";
		  } else if(!userAccount?.balanceAmount || userAccount?.balanceAmount < 1200) {
		  	result.msg = "Insufficient balance.";
		  } else {
			  const dbwithdrawalRequest: WithdrawalRequest = await this.withdrawalRequestRepository.create(withdrawalRequest);
			  result.code = 0;
			  result.msg = "Withdrawal request created successfully.";
			  result.withdrawalRequest = dbwithdrawalRequest;
		  }
		} catch (e){
			result.msg = e.message;
		}
	  
    return JSON.stringify(result);
  }
 
  @get('/withdrawalRequests/serviceProvider/{serviceProviderId}/getAllRequests')
  @response(200, {
    description: 'Array of WithdrawalRequest model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WithdrawalRequest, {includeRelations: true}),
        },
      },
    },
  })
  async serviceProviderGetAllRequests(
	  @param.path.string('serviceProviderId') serviceProviderId: string,
    @param.filter(WithdrawalRequest) filter?: Filter<WithdrawalRequest>,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while getting withdrawal requests.", withdrawalRequest: {}};
	  try{
		  if(filter){
		  	filter.where = {...filter?.where, serviceProviderId: serviceProviderId};
		  }
		  if(serviceProviderId) {
				result.withdrawalRequest = await this.withdrawalRequestRepository.find(filter);
				result.code = 0;
				result.msg = "Withdrawal requests fetched successfully."  
			}
		} catch (e){
			result.msg = e.message;
		}
  	return JSON.stringify(result);
  }
  
  @get('/withdrawalRequests/Admin/getAllRequests')
  @response(200, {
    description: 'Array of WithdrawalRequest model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(WithdrawalRequest, {includeRelations: true}),
        },
      },
    },
  })
  async adminGetAllRequests(
    @param.filter(WithdrawalRequest) filter?: Filter<WithdrawalRequest>,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while getting withdrawal requests.", withdrawalRequest: {}};
    try{
	    result.withdrawalRequest = await this.withdrawalRequestRepository.find(filter);
			result.code = 0;
			result.msg = "Withdrawal requests fetched successfully.";
		} catch (e){
			result.msg = e.message;
		} 
  	return JSON.stringify(result);
  }

  @get('/withdrawalRequests/fetchWithdrawalRequest/{id}')
  @response(200, {
    description: 'WithdrawalRequest model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(WithdrawalRequest, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(WithdrawalRequest, {exclude: 'where'}) filter?: FilterExcludingWhere<WithdrawalRequest>
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while getting withdrawal request.", withdrawalRequest: {}};
    try{
	    result.withdrawalRequest = await this.withdrawalRequestRepository.findById(id, filter);
			result.code = 0;
			result.msg = "Withdrawal request fetched successfully.";
		} catch (e){
			result.msg = e.message;
		}
  	return JSON.stringify(result);
  }

  @post('/withdrawalRequests/updateWithdrawalRequest/{id}')
  @response(200, {
    description: 'WithdrawalRequest PATCH success',
  })
  async updateWithdrawalRequest(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(WithdrawalRequest, {partial: true}),
        },
      },
    })
    withdrawalRequest: WithdrawalRequest,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while getting withdrawal requests.", withdrawalRequest: {}};
    try{
			await this.withdrawalRequestRepository.updateById(id, withdrawalRequest);
	    result.withdrawalRequest = await this.withdrawalRequestRepository.findById(id, {});
			result.code = 0;
			result.msg = "Withdrawal requests fetched successfully.";
		} catch (e){
			result.msg = e.message;
		}
  	return JSON.stringify(result);
  }

  @post('/withdrawalRequests/deleteWithdrawalRequest/{id}')
  @response(200, {
    description: 'WithdrawalRequest DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.withdrawalRequestRepository.deleteById(id);
  }
}
