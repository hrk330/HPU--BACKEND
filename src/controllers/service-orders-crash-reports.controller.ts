import {
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {
  ServiceOrders,
  CrashReports,
  Witness,
} from '../models';
import {CrashReportsRepository, ServiceOrdersRepository, UserDocsRepository} from '../repositories';

export class ServiceOrdersCrashReportsController {
  constructor(
    @repository(ServiceOrdersRepository) protected serviceOrdersRepository: ServiceOrdersRepository,
    @repository(CrashReportsRepository) protected crashReportsRepository: CrashReportsRepository,
    @repository(UserDocsRepository) protected userDocsRepository : UserDocsRepository,
  ) { }

  @get('/serviceOrders/{id}/getcrashReport', {
    responses: {
      '200': {
        description: 'ServiceOrders has one CrashReports',
        content: {
          'application/json': {
            schema: getModelSchemaRef(CrashReports),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<CrashReports>,
  ): Promise<string> {
    const result = {code: 5, msg: "Some error occured while getting crash report.", crashReport: {}};
	  try{
	    const crashReport: CrashReports = await this.serviceOrdersRepository.crashReport(id).get(filter);
	    if(crashReport){
		    const witnessList: Witness[] = await this.crashReportsRepository.witnesses(crashReport.crashReportId).find();
		    if(crashReport.crashReportDocIds) {
		    	crashReport.crashReportDocs = await this.userDocsRepository.find({where: {id: {inq: crashReport.crashReportDocIds}}});
	    	}	    	
	    	if(crashReport.otherPartyDocIds) {
		    	crashReport.otherPartyDocs = await this.userDocsRepository.find({where: {id: {inq: crashReport.otherPartyDocIds}}});
	    	}
		    crashReport.witnessList = witnessList;
		    result.crashReport = crashReport;
		    result.code = 0;
	    	result.msg = "Crash report fetched successfully.";
    	}
    } catch(e) {
			console.log(e);
		}
    return JSON.stringify(result);
  }

  @post('/serviceOrders/{id}/createCrashReport', {
    responses: {
      '200': {
        description: 'ServiceOrders model instance',
        content: {'application/json': {schema: getModelSchemaRef(CrashReports)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof ServiceOrders.prototype.serviceOrderId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CrashReports, {
            title: 'NewCrashReportsInServiceOrders',
            exclude: ['crashReportId'],
            optional: ['serviceOrderId']
          }),
        },
      },
    }) crashReports: Omit<CrashReports, 'crashReportId'>,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while creating crash report.", crashReport: {}};
	  try{
		  const witnessList: Witness[] = crashReports.witnessList;
		  crashReports.witnessList = [];
	    const dbCrashReport: CrashReports = await this.serviceOrdersRepository.crashReport(id).create(crashReports);
	    if(dbCrashReport){
				if(witnessList?.length > 0) {
					for (const witness of witnessList){
						dbCrashReport.witnessList.push(await this.crashReportsRepository.witnesses(dbCrashReport.crashReportId).create(witness));
					}
				}
				if(dbCrashReport.crashReportDocIds) {
		    	dbCrashReport.crashReportDocs = await this.userDocsRepository.find({where: {id: {inq: dbCrashReport.crashReportDocIds}}});
	    	}	    	
	    	if(dbCrashReport.otherPartyDocIds) {
		    	dbCrashReport.otherPartyDocs = await this.userDocsRepository.find({where: {id: {inq: dbCrashReport.otherPartyDocIds}}});
	    	}
				result.crashReport = dbCrashReport;
		    result.code = 0;
	    	result.msg = "Crash report created successfully.";
			}
    } catch(e) {
			console.log(e);
		}
    return JSON.stringify(result);
  }

  @post('/serviceOrders/{id}/updateCrashReport', {
    responses: {
      '200': {
        description: 'ServiceOrders.CrashReports PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CrashReports, {partial: true}),
        },
      },
    })
    crashReports: Partial<CrashReports>,
   @param.where(CrashReports) where?: Where<CrashReports>,
  ): Promise<string> {
	  const result = {code: 5, msg: "Some error occured while updating crash report.", crashReport: {}};
	  try{
		  await this.serviceOrdersRepository.crashReport(id).patch(crashReports, where);
	    const crashReport: CrashReports = await this.serviceOrdersRepository.crashReport(id).get();
	    if(crashReport){
		    const witnessList: Witness[] = await this.crashReportsRepository.witnesses(crashReport.crashReportId).find();
		    if(crashReport.crashReportDocIds) {
		    	crashReport.crashReportDocs = await this.userDocsRepository.find({where: {id: {inq: crashReport.crashReportDocIds}}});
	    	}	    	
	    	if(crashReport.otherPartyDocIds) {
		    	crashReport.otherPartyDocs = await this.userDocsRepository.find({where: {id: {inq: crashReport.otherPartyDocIds}}});
	    	}
		    crashReport.witnessList = witnessList;
		    result.crashReport = crashReport;
		    result.code = 0;
	    	result.msg = "Crash report updated successfully.";
    	}
    } catch(e) {
			console.log(e);
		}
    return JSON.stringify(result);
  }

 /*@del('/serviceOrders/{id}/crash-reports', {
    responses: {
      '200': {
        description: 'ServiceOrders.CrashReports DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(CrashReports)) where?: Where<CrashReports>,
  ): Promise<Count> {
    return this.serviceOrdersRepository.crashReport(id).delete(where);
  }*/
}
