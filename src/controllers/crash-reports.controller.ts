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
import {CrashReports} from '../models';
import {CrashReportsRepository} from '../repositories';

export class CrashReportsController {
  constructor(
    @repository(CrashReportsRepository)
    public crashReportsRepository: CrashReportsRepository,
  ) {}

  @post('/crashReports')
  @response(200, {
    description: 'CrashReports model instance',
    content: {'application/json': {schema: getModelSchemaRef(CrashReports)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CrashReports, {
            title: 'NewCrashReports',
            exclude: ['crashReportId'],
          }),
        },
      },
    })
    crashReports: Omit<CrashReports, 'crashReportId'>,
  ): Promise<CrashReports> {
    return this.crashReportsRepository.create(crashReports);
  }

  @get('/crashReports/count')
  @response(200, {
    description: 'CrashReports model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(CrashReports) where?: Where<CrashReports>,
  ): Promise<Count> {
    return this.crashReportsRepository.count(where);
  }

  @get('/crashReports')
  @response(200, {
    description: 'Array of CrashReports model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(CrashReports, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(CrashReports) filter?: Filter<CrashReports>,
  ): Promise<CrashReports[]> {
    return this.crashReportsRepository.find(filter);
  }

  @get('/crashReports/{id}')
  @response(200, {
    description: 'CrashReports model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(CrashReports, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(CrashReports, {exclude: 'where'})
    filter?: FilterExcludingWhere<CrashReports>,
  ): Promise<CrashReports> {
    return this.crashReportsRepository.findById(id, filter);
  }

  @patch('/crashReports/{id}')
  @response(204, {
    description: 'CrashReports PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CrashReports, {partial: true}),
        },
      },
    })
    crashReports: CrashReports,
  ): Promise<void> {
    await this.crashReportsRepository.updateById(id, crashReports);
  }

  @put('/crashReports/{id}')
  @response(204, {
    description: 'CrashReports PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() crashReports: CrashReports,
  ): Promise<void> {
    await this.crashReportsRepository.replaceById(id, crashReports);
  }

  @del('/crashReports/{id}')
  @response(204, {
    description: 'CrashReports DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.crashReportsRepository.deleteById(id);
  }
}
