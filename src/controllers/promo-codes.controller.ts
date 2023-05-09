import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {PromoCodes} from '../models';
import {PromoCodesRepository} from '../repositories';

export class PromoCodesController {
  constructor(
    @repository(PromoCodesRepository)
    public promoCodesRepository: PromoCodesRepository,
  ) { }

  @post('/promoCodes/createPromoCode')
  @response(200, {
    description: 'PromoCodes model instance',
    content: {'application/json': {schema: getModelSchemaRef(PromoCodes)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {
            title: 'NewPromoCodes',
            exclude: ['promoId'],
          }),
        },
      },
    })
    promoCodes: Omit<PromoCodes, 'promoId'>,
  ): Promise<PromoCodes> {
    return this.promoCodesRepository.create(promoCodes);
  }

  @get('/promoCodes/count')
  @response(200, {
    description: 'PromoCodes model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PromoCodes) where?: Where<PromoCodes>,
  ): Promise<Count> {
    return this.promoCodesRepository.count(where);
  }

  @get('/promoCodes/getPromoCodes')
  @response(200, {
    description: 'Array of PromoCodes model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PromoCodes, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PromoCodes) filter?: Filter<PromoCodes>,
  ): Promise<PromoCodes[]> {
    return this.promoCodesRepository.find(filter);
  }

  @patch('/promoCodes')
  @response(200, {
    description: 'PromoCodes PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {partial: true}),
        },
      },
    })
    promoCodes: PromoCodes,
    @param.where(PromoCodes) where?: Where<PromoCodes>,
  ): Promise<Count> {
    return this.promoCodesRepository.updateAll(promoCodes, where);
  }

  @get('/promoCodes/{promoId}')
  @response(200, {
    description: 'PromoCodes model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PromoCodes, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('promoId') promoId: string,
    @param.filter(PromoCodes, {exclude: 'where'}) filter?: FilterExcludingWhere<PromoCodes>
  ): Promise<PromoCodes> {
    return this.promoCodesRepository.findById(promoId, filter);
  }

  @post('/promoCodes/updatePromoCode')
  @response(204, {
    description: 'PromoCodes PATCH success',
  })
  async updateById(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PromoCodes, {partial: true}),
        },
      },
    })
    promoCodes: PromoCodes,
  ): Promise<void> {
    await this.promoCodesRepository.updateById(promoCodes.promoId, promoCodes);
  }

  @put('/promoCodes/{promoId}')
  @response(204, {
    description: 'PromoCodes PUT success',
  })
  async replaceById(
    @param.path.string('promoId') promoId: string,
    @requestBody() promoCodes: PromoCodes,
  ): Promise<void> {
    await this.promoCodesRepository.replaceById(promoId, promoCodes);
  }

  @del('/promoCodes/{promoId}')
  @response(204, {
    description: 'PromoCodes DELETE success',
  })
  async deleteById(@param.path.string('promoId') promoId: string): Promise<void> {
    await this.promoCodesRepository.deleteById(promoId);
  }
}
