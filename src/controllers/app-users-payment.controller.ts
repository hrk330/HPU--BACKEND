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
  AppUsers,
  Payment,
} from '../models';
import {AppUsersRepository} from '../repositories';

export class AppUsersPaymentController {
  constructor(
    @repository(AppUsersRepository) protected appUsersRepository: AppUsersRepository,
  ) { }

  @get('/app-users/{id}/payments', {
    responses: {
      '200': {
        description: 'Array of AppUsers has many Payment',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Payment)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Payment>,
  ): Promise<Payment[]> {
    return this.appUsersRepository.payments(id).find(filter);
  }

  @post('/app-users/{id}/payments', {
    responses: {
      '200': {
        description: 'AppUsers model instance',
        content: {'application/json': {schema: getModelSchemaRef(Payment)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof AppUsers.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {
            title: 'NewPaymentInAppUsers',
            exclude: ['paymentId'],
            optional: ['payerId']
          }),
        },
      },
    }) payment: Omit<Payment, 'paymentId'>,
  ): Promise<Payment> {
    return this.appUsersRepository.payments(id).create(payment);
  }

  @patch('/app-users/{id}/payments', {
    responses: {
      '200': {
        description: 'AppUsers.Payment PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Payment, {partial: true}),
        },
      },
    })
    payment: Partial<Payment>,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.appUsersRepository.payments(id).patch(payment, where);
  }

  @del('/app-users/{id}/payments', {
    responses: {
      '200': {
        description: 'AppUsers.Payment DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Payment)) where?: Where<Payment>,
  ): Promise<Count> {
    return this.appUsersRepository.payments(id).delete(where);
  }
}
