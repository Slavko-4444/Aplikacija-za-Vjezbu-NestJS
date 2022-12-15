import { Param ,Body, Controller, Post, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Crud } from "@nestjsx/crud";
import { Article } from "src/output/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ApiResponse } from "src/msci/api.response.class";
import { ArticleService } from "src/services/article/article.service";
import { diskStorage } from 'multer';
import { StorageConfiguraion } from "config/storage.config";
import { Photo } from "src/output/entities/photo.entity";
import { PhotoService } from "src/services/photoService/photo.service";
import * as fileType from 'file-type';
import * as fs from 'fs';
import * as sharp from 'sharp';

@Controller('api/article')
@Crud(
    { 
        model: {
            type: Article,
        },
        params: {
            id: {
                field: 'articleId',
                type: 'number',
                primary: true
            }
        },
        query: {
            join: {
                articleFeatures: {
                    eager: true
                },
                category: {
                    eager: true   
                },
                features: {
                    eager: true
                },
                articlePrices: {
                    eager: true
                },

            }
        }
    }    
)
export class ArtilceController {
    constructor(
        public service: ArticleService,
        public photoService: PhotoService
    )
    { }
    // POST http://localhost:3000:/api/article/fullArticle
    @Post('fullArticle')
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.addFullArticle(data);
    }

    // Radimo uploadovanje fotografija:
    //koristimo @UseInterceptor da presretne datoteku i ispita da li je to ono sto mi ocekujemo da se posalje
    
    @Post(':id/uploadPhoto/')
    @UseInterceptors(
        FileInterceptor('photo', {
            // diskStorage importujemo iz multer-a kojeg smo prethodno instalirali: npm i @types/express -D
            storage: diskStorage({

                destination: StorageConfiguraion.photo.destination,
                filename: (req, file, callback) => {
                    // ovdje nas ne zanima req, jer se u njemu nalaze podaci za velicinu fajla, podaci korisnika itd..
                    // u ovom polju zanima nas ime fajla i njegova optimizacija:
                    /**
                     *  poslat fajl -> 'Slika  Slavko (Sosic).jpg'
                     *  dobiti fajl imena -> '<datum>-<(1-10)->10 puta>.jpg>
                     * 
                     */
                    let original: string = file.originalname;
                    let normalized: string = original.replace(/\s+/g, '-');
                    normalized = normalized.replace(/[^A-z0-9\.\-]/g, ''); // sve sto nije ovo globalno, zamjeni praznim stringom
                    let tempTime = new Date();
                    let dateString: string = '';
                    dateString = tempTime.getFullYear().toString() + (tempTime.getMonth() + 1).toString() + tempTime.getDate().toString();
                    
                    let randomPart: string = new Array(10)
                        .fill(0)
                        .map(e => (Math.random() * 9).toFixed(0).toString()).join('');// sa metodom join se niz pretvara u string!

                    let fileName: string = dateString + '-' +randomPart +'-' + normalized;
                    fileName = fileName.toLowerCase();// za svaki slucaj da nam je bolja optimalnost naziva slika...

                    callback(null, fileName);
                }
            }),
            fileFilter:(req, file, callback) => {
                // 1. Provjera extenzije file
                if (!file.originalname.match(/\.(jpg|png)$/)) {
                    req.ErrorReqHandler = 'Incorrect file extension'; // proizvoljno nazivamo objekat koji dodavamo...
                    callback(null, false); // new Error('Incorrect file extension') smo mogli umjesto null, ali nam error ne treba u konzoli vec povratna informacija...
                    return;
                }
                
                // 2. Provjera tipa sadrzaja file (mimetype) : image/jpeg, image/png...
                if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
                    req.ErrorReqHandler = 'Unacceptable file mimetype';
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1,
                fileSize: StorageConfiguraion.photo.maxSize
            }
        })
    )
    async uploadPhoto( @Param('id') articleId: number, @UploadedFile() photo, @Req() req): Promise<ApiResponse|Photo> {

      
        if (req.ErrorReqHandler)
            return new ApiResponse('error', -4005, req.ErrorReqHandler);
        
        //real mimetype checkout
        let FileTypeResult = await fileType.fromFile(photo.path);

        if (!FileTypeResult) {
            fs.unlinkSync(photo.path); // synchronously remove file
            return new ApiResponse('error', -453, 'Cannot read the file');
        }

        if (!(FileTypeResult.mime.includes('jpeg') || FileTypeResult.mime.includes('png'))) {
            fs.unlinkSync(photo.path);
            return new ApiResponse('error', -454, 'Unregular mimetype detected');
        }

        // save resized file
        await this.createResizedImage(photo, StorageConfiguraion.photo.resize.thumb);        
        await this.createResizedImage(photo, StorageConfiguraion.photo.resize.small);        

        
        let newPhoto = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename;

        const savedPhoto = await this.photoService.add(newPhoto);
        if (!savedPhoto) 
            return new ApiResponse('error', -4004);
        
        return savedPhoto;
    }

    async createResizedImage(photo, resizeSettings) {
       
        const destination = resizeSettings.path + "/" + photo.filename;

        await sharp(photo.path).resize({
            fit: 'contain',
            background: { r: 255, g: 255, b: 255, alpha: 0.0 },
            widht: resizeSettings.widht,
            height: resizeSettings.height
        }).toFile(destination);
    }

    
}