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
  Company,
  UserCreds,
} from '../models';
import {CompanyRepository} from '../repositories';

export class CompanyUserCredsController {
  constructor(
    @repository(CompanyRepository) protected companyRepository: CompanyRepository,
  ) { }

  @get('/companies/{id}/user-creds', {
    responses: {
      '200': {
        description: 'Company has one UserCreds',
        content: {
          'application/json': {
            schema: getModelSchemaRef(UserCreds),
          },
        },
      },
    },
  })
  async get(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserCreds>,
  ): Promise<UserCreds> {
    return this.companyRepository.userCreds(id).get(filter);
  }

  @post('/companies/{id}/user-creds', {
    responses: {
      '200': {
        description: 'Company model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCreds)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof Company.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {
            title: 'NewUserCredsInCompany',
            exclude: ['id'],
            optional: ['userId']
          }),
        },
      },
    }) userCreds: Omit<UserCreds, 'id'>,
  ): Promise<UserCreds> {
    return this.companyRepository.userCreds(id).create(userCreds);
  }

  @patch('/companies/{id}/user-creds', {
    responses: {
      '200': {
        description: 'Company.UserCreds PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {partial: true}),
        },
      },
    })
    userCreds: Partial<UserCreds>,
    @param.query.object('where', getWhereSchemaFor(UserCreds)) where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.companyRepository.userCreds(id).patch(userCreds, where);
  }

  @del('/companies/{id}/user-creds', {
    responses: {
      '200': {
        description: 'Company.UserCreds DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCreds)) where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.companyRepository.userCreds(id).delete(where);
  }
}
