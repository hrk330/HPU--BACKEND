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
import {UserDocs} from '../models';
import {UserDocsRepository} from '../repositories';

export class UserDocsController {
  constructor(
    @repository(UserDocsRepository)
    public userDocsRepository : UserDocsRepository,
  ) {}

  @post('/userDocs')
  @response(200, {
    description: 'UserDocs model instance',
    content: {'application/json': {schema: getModelSchemaRef(UserDocs)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {
            title: 'NewUserDocs',
            exclude: ['id'],
          }),
        },
      },
    })
    userDocs: Omit<UserDocs, 'id'>,
  ): Promise<UserDocs> {
    return this.userDocsRepository.create(userDocs);
  }

  @get('/userDocs/count')
  @response(200, {
    description: 'UserDocs model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(UserDocs) where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.userDocsRepository.count(where);
  }

  @get('/userDocs')
  @response(200, {
    description: 'Array of UserDocs model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(UserDocs, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(UserDocs) filter?: Filter<UserDocs>,
  ): Promise<UserDocs[]> {
    return this.userDocsRepository.find(filter);
  }

  @patch('/userDocs')
  @response(200, {
    description: 'UserDocs PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {partial: true}),
        },
      },
    })
    userDocs: UserDocs,
    @param.where(UserDocs) where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.userDocsRepository.updateAll(userDocs, where);
  }

  @get('/userDocs/{id}')
  @response(200, {
    description: 'UserDocs model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(UserDocs, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(UserDocs, {exclude: 'where'}) filter?: FilterExcludingWhere<UserDocs>
  ): Promise<UserDocs> {
    return this.userDocsRepository.findById(id, filter);
  }

  @post('/userDocs/updateUserDocs/{id}')
  @response(200, {
    description: 'UserDocs update success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {partial: true}),
        },
      },
    })
    userDocs: UserDocs,
  ): Promise<string> {
    const result = {code: 0, msg: "Document updated successfully."};
    await this.userDocsRepository.updateById(id, userDocs);
    return JSON.stringify(result);
  }

  @put('/userDocs/{id}')
  @response(204, {
    description: 'UserDocs PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() userDocs: UserDocs,
  ): Promise<void> {
    await this.userDocsRepository.replaceById(id, userDocs);
  }

  @del('/userDocs/{id}')
  @response(204, {
    description: 'UserDocs DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userDocsRepository.deleteById(id);
  }
}
