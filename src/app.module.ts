import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';// importovali smo
import { DatabaseConfiguration } from 'config/database.configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfiguration } from 'config/database.configuration';
import { Administrator } from './administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      port: 3306,
      username: DatabaseConfiguration.username,
      password: DatabaseConfiguration.password,
      database: DatabaseConfiguration.database,
      entities: [ Administrator ]
    }),
    TypeOrmModule.forFeature([ Administrator ])
  ],
  controllers: [AppController],
  providers: [AppService, AdministratorService],
})
export class AppModule {}
