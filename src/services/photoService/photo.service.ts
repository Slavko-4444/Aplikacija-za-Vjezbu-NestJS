import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Photo } from "src/output/entities/photo.entity";
import { Repository } from "typeorm";



@Injectable()
export class PhotoService extends TypeOrmCrudService<Photo> {
    constructor(
        @InjectRepository(Photo) private readonly service: Repository<Photo>) {
        super(service);
    }


    add(photo: Photo): Promise<Photo> {
        return this.service.save(photo);   
    }

    async delete(photoId: number) {
        return await this.service.delete(photoId);
    }
}