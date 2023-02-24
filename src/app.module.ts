import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MatchesModule } from './matches/matches.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import * as Joi from 'joi';
import { DatabaseModule } from '@app/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        DATABASE_HOST: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        DATABASE_SYNCHRONIZE: Joi.string().required(),
        DATABASE_LOGGING: Joi.string().required(),
        REDIS_URL: Joi.string().required(),
      }),
      envFilePath: './.env',
    }),
    DatabaseModule,  
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        config: {
          url: configService.get<string>('REDIS_URL'),
        },
      }),
      inject: [ConfigService],
    }),
    MatchesModule,
    TeamsModule,
    TournamentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
