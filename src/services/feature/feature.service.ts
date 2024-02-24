import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import DisinctFeatureValuesDto from "src/dtos/features/distinct.feature.values.dto";
import { ArticleFeature } from "src/output/entities/article-feature.entity";
import { Feature } from "src/output/entities/feature.entity";
import { Repository } from "typeorm";


@Injectable()
export class FeatureService extends TypeOrmCrudService<Feature> {
    constructor(
        @InjectRepository(Feature) private readonly feature: Repository<Feature>,
        @InjectRepository(ArticleFeature) private readonly articleFeature: Repository<ArticleFeature>
    ) {
        super(feature);
    }


    async getDistinctValByCatId(CategoryId: number): Promise<DisinctFeatureValuesDto> {
        const features = await this.feature.find({ where: { categoryId: CategoryId } })
        
        const featureResults: DisinctFeatureValuesDto = { features: [],};
        if (!features || features.length === 0)
            return featureResults;

        // kad radimo mapiranje sa await metodom, moramo ga uokviriti u Promise.all()
        featureResults.features = await Promise.all(features.map(async feature => {
            const values: string[] = (
                await this.articleFeature.createQueryBuilder("af")
                    .select("DISTINCT af.value", 'value')
                    .where('af.featureId = :featureId', { featureId: feature.featureId })
                    .orderBy('af.value', 'ASC')
                    .getRawMany()).map(item => item.value);
            
            return {
                featureId: feature.featureId,
                name: feature.name,
                values: values,
            }
        }));
        return featureResults;
    }
} 