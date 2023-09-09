import {Company, ServiceProvider, Transaction, TransactionResponse} from '../models';
import {CompanyRepository, ServiceProviderRepository, TransactionRepository} from '../repositories';

export class ServiceOrdersUtils {
  populateTransactionObject = (
    transactionResponse: TransactionResponse,
    serviceOrderId: string,
  ) => {
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

    return transaction;
  }

  async getServiceProvider(
    serviceProviderId: string,
    serviceProviderRepository: ServiceProviderRepository,
  ): Promise<ServiceProvider> {
    let serviceProvider: ServiceProvider = new ServiceProvider();
    if (serviceProviderId) {
      serviceProvider = await serviceProviderRepository.findById(
        serviceProviderId,
        {fields: ['id', 'email', 'firstName', 'lastName', 'endpoint', 'companyId']},
      );
    }
    return serviceProvider;
  }

  async processTransactionResponse(
    transactionResponse: TransactionResponse,
    serviceOrderId: string,
    transactionRepository: TransactionRepository
  ): Promise<void> {
    const transaction: Transaction = this.populateTransactionObject(transactionResponse, serviceOrderId);
    await transactionRepository.create(transaction);
  }

  async getCompany(
    companyId: string,
    companyRepository: CompanyRepository,
  ): Promise<Company> {
    let company: Company = new Company();
    try {
      if (companyId) {
        company = await companyRepository.findById(companyId, {
          fields: ['id', 'email', 'companyName'],
        });
      }
    } catch (e) {
      console.log(e);
    }
    return company;
  }
}