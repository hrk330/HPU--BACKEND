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
import {Menus} from '../models';
import {MenusRepository} from '../repositories';

export class MenusController {
  constructor(
    @repository(MenusRepository)
    public menusRepository: MenusRepository,
  ) { }

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

  @get('/menus/getAllMenus')
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
    const dbMenusList: Menus[] = await this.menusRepository.find({where: {isActive: 'Y'}});
    const parentChildMenuStructure = new Array<Menus>;

    dbMenusList.forEach((parentMenu) => {
      dbMenusList.forEach((childMenu) => {
        if (childMenu.parentMenuId && childMenu.parentMenuId.toString() === parentMenu.menuId.toString()) {
          if (parentMenu.children === undefined) {
            parentMenu.children = new Array<Menus>;
          }
          childMenu.subChildren = new Array<Menus>;
          if (parentMenu.subChildren !== undefined) {
            childMenu.parentMenuId = parentMenu.parentMenuId;
            parentMenu.subChildren.push(childMenu);
          } else {
            parentMenu.children.push(childMenu);
          }
        }
      });
      parentMenu.isViewAllowed = "";
      parentMenu.isCreateAllowed = "";
      parentMenu.isUpdateAllowed = "";
      parentMenu.isDeleteAllowed = "";
      parentChildMenuStructure.push(parentMenu);
    });
    for (let index = 0; index < parentChildMenuStructure.length;) {
      if (parentChildMenuStructure[index].parentMenuId !== '') {
        parentChildMenuStructure.splice(index, 1);
      } else {
        index++;
      }
    }
    return parentChildMenuStructure;
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
