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
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  CrashReports,
  Witness,
} from '../models';
import {CrashReportsRepository} from '../repositories';

export class CrashReportsWitnessController {
  constructor(
    @repository(CrashReportsRepository) protected crashReportsRepository: CrashReportsRepository,
  ) { }

  @get('/crash-reports/{id}/witnesses', {
    responses: {
      '200': {
        description: 'Array of CrashReports has many Witness',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Witness)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Witness>,
  ): Promise<Witness[]> {
    return this.crashReportsRepository.witnesses(id).find(filter);
  }

  @post('/crash-reports/{id}/witnesses', {
    responses: {
      '200': {
        description: 'CrashReports model instance',
        content: {'application/json': {schema: getModelSchemaRef(Witness)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof CrashReports.prototype.crashReportId,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Witness, {
            title: 'NewWitnessInCrashReports',
            exclude: ['witnessId'],
            optional: ['crashReportId']
          }),
        },
      },
    }) witness: Omit<Witness, 'witnessId'>,
  ): Promise<Witness> {
    return this.crashReportsRepository.witnesses(id).create(witness);
  }

  @patch('/crash-reports/{id}/witnesses', {
    responses: {
      '200': {
        description: 'CrashReports.Witness PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Witness, {partial: true}),
        },
      },
    })
    witness: Partial<Witness>,
    @param.query.object('where', getWhereSchemaFor(Witness)) where?: Where<Witness>,
  ): Promise<Count> {
    return this.crashReportsRepository.witnesses(id).patch(witness, where);
  }

  @del('/crash-reports/{id}/witnesses', {
    responses: {
      '200': {
        description: 'CrashReports.Witness DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Witness)) where?: Where<Witness>,
  ): Promise<Count> {
    return this.crashReportsRepository.witnesses(id).delete(where);
  }
}
