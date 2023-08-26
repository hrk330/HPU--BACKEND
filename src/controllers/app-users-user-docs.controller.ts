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
import {AppUsers, UserDocs} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersUserDocsController {
  constructor(
    @repository(AppUsersRepository)
    protected appUsersRepository: AppUsersRepository,
  ) {}

  @get('/app-users/{id}/user-docs', {
    responses: {
      '200': {
        description: 'Array of AppUsers has many UserDocs',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(UserDocs)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<UserDocs>,
  ): Promise<UserDocs[]> {
    return this.appUsersRepository.userDocs(id).find(filter);
  }

  @post('/app-users/{id}/user-docs', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserDocs)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {
            title: 'NewUserDocsInAppUsers',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userDocs: Omit<UserDocs, 'id'>,
  ): Promise<UserDocs> {
    return this.appUsersRepository.userDocs(id).create(userDocs);
  }

  @patch('/app-users/{id}/user-docs', {
    responses: {
      '200': {
        description: 'AppUsers.UserDocs PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserDocs, {partial: true}),
        },
      },
    })
    userDocs: Partial<UserDocs>,
    @param.query.object('where', getWhereSchemaFor(UserDocs))
    where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.appUsersRepository.userDocs(id).patch(userDocs, where);
  }

  @del('/app-users/{id}/user-docs', {
    responses: {
      '200': {
        description: 'AppUsers.UserDocs DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserDocs))
    where?: Where<UserDocs>,
  ): Promise<Count> {
    return this.appUsersRepository.userDocs(id).delete(where);
  }
}
