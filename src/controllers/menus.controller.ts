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
import {Menus} from '../models';
import {MenusRepository} from '../repositories';

export class MenusController {
  constructor(
    @repository(MenusRepository)
    public menusRepository : MenusRepository,
  ) {}

  @post('/menus')
  @response(200, {
    description: 'Menus model instance',
    content: {'application/json': {schema: getModelSchemaRef(Menus)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menus, {
            title: 'NewMenus',
            exclude: ['menuId'],
          }),
        },
      },
    })
    menus: Omit<Menus, 'menuId'>,
  ): Promise<Menus> {
    return this.menusRepository.create(menus);
  }

  @get('/menus/count')
  @response(200, {
    description: 'Menus model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Menus) where?: Where<Menus>,
  ): Promise<Count> {
    return this.menusRepository.count(where);
  }

  @get('/menus')
  @response(200, {
    description: 'Array of Menus model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Menus, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Menus) filter?: Filter<Menus>,
  ): Promise<Menus[]> {
    return this.menusRepository.find(filter);
  }

  @patch('/menus')
  @response(200, {
    description: 'Menus PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menus, {partial: true}),
        },
      },
    })
    menus: Menus,
    @param.where(Menus) where?: Where<Menus>,
  ): Promise<Count> {
    return this.menusRepository.updateAll(menus, where);
  }

  @get('/menus/{id}')
  @response(200, {
    description: 'Menus model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Menus, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Menus, {exclude: 'where'}) filter?: FilterExcludingWhere<Menus>
  ): Promise<Menus> {
    return this.menusRepository.findById(id, filter);
  }

  @patch('/menus/{id}')
  @response(204, {
    description: 'Menus PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Menus, {partial: true}),
        },
      },
    })
    menus: Menus,
  ): Promise<void> {
    await this.menusRepository.updateById(id, menus);
  }

  @put('/menus/{id}')
  @response(204, {
    description: 'Menus PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() menus: Menus,
  ): Promise<void> {
    await this.menusRepository.replaceById(id, menus);
  }

  @del('/menus/{id}')
  @response(204, {
    description: 'Menus DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.menusRepository.deleteById(id);
  }
}
