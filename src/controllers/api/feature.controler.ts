import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { AllowToRoles } from "src/msci/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "src/msci/role.check.guards";
import { Feature } from "src/output/entities/feature.entity";
import { FeatureService } from "src/services/feature/feature.service";



@Controller('api/feature')
@Crud({ 
    model: {
        type: Feature
    },
    params: {
        id: {
            field: 'featureId',
            type: 'number',
            primary: true
        }
    },
    query: {
        join: {
            articles: {
                eager: false
            },
            category: {
                eager: true
            },
            articleFeatures: {
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
 })
export class FeatureController { 
    constructor(private service: FeatureService) { }
    
}
