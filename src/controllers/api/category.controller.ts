import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AllowToRoles } from "src/msci/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/msci/role.check.guards";
import { Category } from "src/output/entities/category.entity";
import { CategoryService } from "src/services/category/category.service";


@Controller('api/category')
@Crud(
    {
        model: {
            type: Category
        },
        params: {
            id: {
                field: 'categoryId',
                type: 'number',
                primary: true
            }
        },
        query: {
            join: {
                categories: {
                    eager: false
                },
                parentCategory: {
                    eager: false
                },
                features: {
                    eager: true
                },
                articles: {
                    eager: false   
                }
            }
        },
        routes: {
            only: ["createManyBase", "createOneBase", "updateOneBase", "getManyBase", "getOneBase"],
            createManyBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator')
                ],
            },
            createOneBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator')
                ]
            },
            updateOneBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator')
                ]
            },
            getManyBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user')
                ]
            },
            getOneBase: {
                decorators: [
                    UseGuards(RoleCheckedGuard),
                    AllowToRoles('administrator', 'user')
                ]
            }
        }
    }
)
export class CategoryController {
    constructor(public service: CategoryService)
    { }
}