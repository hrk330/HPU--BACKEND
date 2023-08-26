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
import {AppUsers, UserCreds} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersUserCredsController {
  constructor(
    @repository(AppUsersRepository)
    protected appUsersRepository: AppUsersRepository,
  ) {}

  @get('/app-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AppUsers has one UserCreds',
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
    return this.appUsersRepository.userCreds(id).get(filter);
  }

  @post('/app-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(UserCreds)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(UserCreds, {
            title: 'NewUserCredsInAppUsers',
            exclude: ['id'],
            optional: ['userId'],
          }),
        },
      },
    })
    userCreds: Omit<UserCreds, 'id'>,
  ): Promise<UserCreds> {
    return this.appUsersRepository.userCreds(id).create(userCreds);
  }

  @patch('/app-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AppUsers.UserCreds PATCH success count',
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
    @param.query.object('where', getWhereSchemaFor(UserCreds))
    where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.appUsersRepository.userCreds(id).patch(userCreds, where);
  }

  @del('/app-users/{id}/user-creds', {
    responses: {
      '200': {
        description: 'AppUsers.UserCreds DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(UserCreds))
    where?: Where<UserCreds>,
  ): Promise<Count> {
    return this.appUsersRepository.userCreds(id).delete(where);
  }
}
