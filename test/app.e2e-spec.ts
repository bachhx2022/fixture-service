import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TeamsModule } from 'src/teams/teams.module';
import { MatchesModule } from 'src/matches/matches.module';
import { TournamentsModule } from 'src/tournaments/tournaments.module';
import { Team } from 'src/teams/team.entity';
import { Tournament } from 'src/tournaments/tournament.entity';
import { Match } from 'src/matches/match.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { DatabaseModule } from '@app/common';

describe('Matches (e2e)', () => {
  let app: INestApplication;
  let teamsRepository: Repository<Team>;
  let tournamentsRepository: Repository<Tournament>;
  let matchesRepository: Repository<Match>;
  const matches: Match[] = [];

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
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
          envFilePath: './test/.env',
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
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();

    teamsRepository = app.get(getRepositoryToken(Team));
    tournamentsRepository = app.get(getRepositoryToken(Tournament));
    matchesRepository = app.get(getRepositoryToken(Match));

    const team1 = new Team();
    team1.name = 'Argentina';
    const team2 = new Team();
    team2.name = 'Poland';
    await teamsRepository.save(team1);
    await teamsRepository.save(team2);

    const tournament = new Tournament();
    tournament.name = 'FIFA World Cup 2022';
    await tournamentsRepository.save(tournament);

    const match = new Match();
    match.tournamentId = tournament.id;
    match.homeTeamId = team1.id;
    match.awayTeamId = team2.id;
    match.startAt = new Date();
    match.endAt = new Date();

    await matchesRepository.save(match);
    matches.push(match);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('/matches (GET)', () => {
    it('Should return matches with status 200', async () => {
      // ARRANGE
      const params = {
        from: '2021-01-10T02:26:20.938Z',
        to: '2024-01-16T02:26:20.938Z',
        tournamentId: matches[0].tournamentId,
      };

      // ACT
      const response = await request(app.getHttpServer())
        .get(`/matches?${new URLSearchParams(params).toString()}`)
        .expect(200);

      // ASSERT
      const result = response.body;
      expect(result.matches).toHaveLength(1);
      expect(result.totalMatches).toBe(1);
      expect(result.hasNext).toBe(false);
    });

    it('Should return 400 "Bad Request" when missing tournamentId', async () => {
      // ARRANGE
      const params = {
        from: '2021-01-10T02:26:20.938Z',
        to: '2024-01-16T02:26:20.938Z',
      };

      // ACT && ASSERT
      await request(app.getHttpServer())
        .get(`/matches?${new URLSearchParams(params).toString()}`)
        .expect(400);
    });
  });

  describe('/calendar (GET)', () => {
    it('Should return dates with status 200', async () => {
      // ARRANGE
      const params = {
        from: '2021-01-10T02:26:20.938Z',
        to: '2024-01-16T02:26:20.938Z',
        tournamentId: matches[0].tournamentId,
        timezone: 'Asia/Ho_Chi_Minh',
      };

      // ACT && ASSERT
      await request(app.getHttpServer())
        .get(`/matches/calendar?${new URLSearchParams(params).toString()}`)
        .expect(200);
    });

    it('Should return 400 "Bad Request" when missing timezone', async () => {
      // ARRANGE
      const params = {
        from: '2021-01-10T02:26:20.938Z',
        to: '2024-01-16T02:26:20.938Z',
        tournamentId: matches[0].tournamentId,
      };

      // ACT && ASSERT
      await request(app.getHttpServer())
        .get(`/matches/calendar?${new URLSearchParams(params).toString()}`)
        .expect(400);
    });
  });
});
