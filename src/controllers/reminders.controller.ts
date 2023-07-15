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
import {Reminders} from '../models';
import {RemindersRepository} from '../repositories';

export class RemindersController {
  constructor(
    @repository(RemindersRepository)
    public remindersRepository : RemindersRepository,
  ) {}

  @post('/reminders')
  @response(200, {
    description: 'Reminders model instance',
    content: {'application/json': {schema: getModelSchemaRef(Reminders)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reminders, {
            title: 'NewReminders',
            exclude: ['reminderId'],
          }),
        },
      },
    })
    reminders: Omit<Reminders, 'reminderId'>,
  ): Promise<Reminders> {
    return this.remindersRepository.create(reminders);
  }

  @get('/reminders/count')
  @response(200, {
    description: 'Reminders model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Reminders) where?: Where<Reminders>,
  ): Promise<Count> {
    return this.remindersRepository.count(where);
  }

  @get('/reminders')
  @response(200, {
    description: 'Array of Reminders model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Reminders, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Reminders) filter?: Filter<Reminders>,
  ): Promise<Reminders[]> {
    return this.remindersRepository.find(filter);
  }

  @patch('/reminders')
  @response(200, {
    description: 'Reminders PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reminders, {partial: true}),
        },
      },
    })
    reminders: Reminders,
    @param.where(Reminders) where?: Where<Reminders>,
  ): Promise<Count> {
    return this.remindersRepository.updateAll(reminders, where);
  }

  @get('/reminders/{id}')
  @response(200, {
    description: 'Reminders model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Reminders, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Reminders, {exclude: 'where'}) filter?: FilterExcludingWhere<Reminders>
  ): Promise<Reminders> {
    return this.remindersRepository.findById(id, filter);
  }

  @patch('/reminders/{id}')
  @response(204, {
    description: 'Reminders PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Reminders, {partial: true}),
        },
      },
    })
    reminders: Reminders,
  ): Promise<void> {
    await this.remindersRepository.updateById(id, reminders);
  }

  @put('/reminders/{id}')
  @response(204, {
    description: 'Reminders PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() reminders: Reminders,
  ): Promise<void> {
    await this.remindersRepository.replaceById(id, reminders);
  }

  @del('/reminders/{id}')
  @response(204, {
    description: 'Reminders DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.remindersRepository.deleteById(id);
  }
}
