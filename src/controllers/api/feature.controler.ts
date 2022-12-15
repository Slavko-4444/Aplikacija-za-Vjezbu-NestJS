import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
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
    }
 })
export class FeatureController { 
    constructor(private service: FeatureService) { }
    
}
