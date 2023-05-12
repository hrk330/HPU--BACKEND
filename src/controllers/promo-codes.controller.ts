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
  ): Promise<Object> {
    let result = {code: 5, msg: "", promoCode: {}};
    if (!await this.checkPromoExists("", promoCodes.promoCode)) {
      result.promoCode = await this.promoCodesRepository.create(promoCodes);
      result.code = 0;
      result.msg = "Promo code generated successfully.";
    } else {
      result.msg = "Promo code already exists.";
    }
    return result;
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
  @response(200, {
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
    requestPromoCode: PromoCodes,
  ): Promise<Object> {
    let result = {code: 5, msg: "", promoCode: {}};
    if (!await this.checkPromoExists(requestPromoCode.promoId, requestPromoCode.promoCode)) {
      await this.promoCodesRepository.updateById(requestPromoCode.promoId, requestPromoCode);
      result.promoCode = await this.findById(requestPromoCode.promoId);
      result.code = 0;
      result.msg = "Record updated successfully.";
    } else {
      result.msg = "Duplicate promo code.";
    }
    return result;
  }

  async checkPromoExists(promoId: string, promoCode: string): Promise<boolean> {
    let result: boolean = true;
    try {
      const dbPromoCode: PromoCodes[] = await this.find({where: {promoCode: promoCode}});
      if (dbPromoCode.length < 1 || (dbPromoCode.length < 2 && dbPromoCode[0].promoId === promoId)) {
        result = false;
      }
    } catch (e) {
      console.log(e);
      result = false
    }
    return result;
  }

  @get('/promoCodes/generateRandomPromoCode')
  @response(200, {
    description: 'PromoCodes PATCH success',
  })
  async generateRandomPromo(): Promise<Object> {
    let result = {code: 5, msg: "Invalid Request", promoCode: ""};
    for (let i = 0; i < 50; i++) {
      result.promoCode = await this.generateRandomString(8);
      console.log(result.promoCode);
      if (!await this.checkPromoExists("", result.promoCode)) {
        break;
      }
    }
    result.code = 0;
    result.msg = "Promo code generated successfully.";

    return result;
  }

  async generateRandomString(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
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
