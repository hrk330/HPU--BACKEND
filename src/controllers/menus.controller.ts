import {
  Count,
  CountSchema,
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
import {AdminUsers, Menus, RoleTasks} from '../models';
import {AdminUsersRepository, MenusRepository, RolesRepository} from '../repositories';

export class MenusController {
  constructor(
    @repository(MenusRepository)
    public menusRepository: MenusRepository,
    @repository(AdminUsersRepository)
    public adminUsersRepository: AdminUsersRepository,
    @repository(RolesRepository)
    public rolesRepository: RolesRepository,
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

  @get('/menus/getAllMenus/{userId}')
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
    @param.path.string('userId') userId: string,    
  ): Promise<Menus[]> {
    const dbMenusList: Menus[] = await this.menusRepository.find({where: {isActive: true}});
    const adminUser: AdminUsers = await this.adminUsersRepository.findById(userId, {fields: ['roleId']});
    const dbRoletasks: RoleTasks[] = await this.rolesRepository.roleTasks(adminUser.roleId).find({where: {isActive: true}});
    await this.filterMenuForUserRole(dbMenusList, dbRoletasks);
    const parentChildMenuStructure: Menus[] = [];
    await this.getParentChildMenuStructure(dbMenusList, parentChildMenuStructure);
    return parentChildMenuStructure;
  }
  
  async filterMenuForUserRole(dbMenusList: Menus[], dbRoletasks: RoleTasks[]): Promise<void> {
	  const roleTaskMap = new Map<string, RoleTasks>();  
    for (const dbRoleTask of dbRoletasks) {
      roleTaskMap.set(dbRoleTask.taskId, dbRoleTask);
    }
	  
	  for (let index = 0; index < dbMenusList.length;) {
		  if(roleTaskMap?.has(dbMenusList[index]?.taskId) && roleTaskMap?.get(dbMenusList[index]?.taskId)?.isViewAllowed){
			  
			  const roleTask: RoleTasks| undefined = roleTaskMap.get(dbMenusList[index]?.taskId); 
			  dbMenusList[index].isViewAllowed = roleTask?.isViewAllowed;
	      dbMenusList[index].isCreateAllowed = roleTask?.isCreateAllowed;
	      dbMenusList[index].isUpdateAllowed = roleTask?.isUpdateAllowed;
	      dbMenusList[index].isDeleteAllowed = roleTask?.isDeleteAllowed;
		  
			  index++;
		  }else {
        dbMenusList.splice(index, 1);
      }
    }
  }
  
  async getParentChildMenuStructure(dbMenusList: Menus[], parentChildMenuStructure: Menus[]): Promise<void>{
	  
    dbMenusList.forEach((parentMenu) => {
      dbMenusList.forEach((childMenu) => {
        if (childMenu.parentMenuId && childMenu.parentMenuId.toString() === parentMenu.menuId.toString()) {
          if (parentMenu.children === undefined) {
            parentMenu.children = [];
          }
          childMenu.subChildren = [];
          if (parentMenu.subChildren !== undefined) {
            childMenu.parentMenuId = parentMenu.parentMenuId;
            parentMenu.subChildren.push(childMenu);
          } else {
            parentMenu.children.push(childMenu);
          }
        }
      });
      
      parentChildMenuStructure.push(parentMenu);
    });
    for (let index = 0; index < parentChildMenuStructure.length;) {
      if (parentChildMenuStructure[index].parentMenuId !== '') {
        parentChildMenuStructure.splice(index, 1);
      } else {		  	
        index++;
      }
    }    
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
