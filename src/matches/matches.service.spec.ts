import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';
import { Between, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MockType } from '@app/common/test-utils';
import { Match } from './match.entity';
import { Logger } from '@nestjs/common';
import { SORT_DIRECTION } from '@app/common';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    find: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    findAndCount: jest.fn((entity) => entity),
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawMany: jest.fn((entity) => entity),
    }),
  }),
);

describe('MatchesService', () => {
  let matchesService: MatchesService;
  let repositoryMock: MockType<Repository<Match>>;
  let redisMock: any;

  beforeEach(async () => {
    redisMock = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchesService,
        {
          provide: getRepositoryToken(Match),
          useFactory: repositoryMockFactory,
        },
        {
          provide: 'RedisModule:default',
          useValue: redisMock,
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    matchesService = module.get<MatchesService>(MatchesService);
    repositoryMock = module.get(getRepositoryToken(Match));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    const pages = [[1], [2], [3]];
    test.each(pages)(
      'should call repo with correct params when page is %p',
      async (page) => {
        // ARRANGE
        const dto = {
          tournamentId: 'fake-tournament-id',
          from: new Date(),
          to: new Date(),
          page,
          pageSize: 10,
          sortField: 'startAt',
          sortDirection: SORT_DIRECTION.ASC,
        };
        jest
          .spyOn(repositoryMock, 'findAndCount')
          .mockImplementation(async () => [[], 0]);

        // ACT
        await matchesService.search(dto);

        // ASSERT
        expect(repositoryMock.findAndCount).toBeCalledWith(
          expect.objectContaining({
            where: {
              startAt: Between(dto.from, dto.to),
              tournamentId: dto.tournamentId,
            },
            order: {
              [dto.sortField]: dto.sortDirection,
            },
            skip: (dto.page - 1) * dto.pageSize,
            take: dto.pageSize,
            relations: {
              homeTeam: true,
              awayTeam: true,
            },
            select: {
              id: true,
              startAt: true,
              endAt: true,
              homeTeam: {
                name: true,
                image: true,
              },
              awayTeam: {
                name: true,
                image: true,
              },
              homeTeanScore: true,
              awayTeamScore: true,
            },
          }),
        );
      },
    );

    it('should return all teams', async () => {
      // ARRANGE
      const matches = [];
      const expected = {
        matches: matches,
        totalMatches: matches.length,
        hasNext: false,
      };
      
      repositoryMock.findAndCount.mockReturnValue(
        Promise.resolve([expected.matches, matches.length]),
      );

      // ACT & ASSERT
      expect(
        matchesService.search({
          tournamentId: 'fake-tournament-id',
          from: new Date(),
          to: new Date(),
          page: 1,
          pageSize: 10,
          sortField: 'startAt',
          sortDirection: SORT_DIRECTION.ASC,
        }),
      ).resolves.toEqual(expected);
    });
  });

  describe('getCalendar', () => {
    const dto = {
      tournamentId: 'fake-tournament-id',
      from: new Date(),
      to: new Date(),
      timezone: 'Asia/Ho_Chi_Minh',
    };

    it('should return from cache if existing', async () => {
      // ARRANGE
      const expected = [];
      const cacheKey = `fixtures#getCalendar#${
        dto.tournamentId
      }#${dto.from.toISOString()}#${dto.to.toISOString()}#${dto.timezone}`;
      jest.spyOn(redisMock, 'get').mockResolvedValueOnce(expected);
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(() => []),
      };
      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilder);

      // ACT & ASSERT  
      expect(matchesService.getCalendar(dto)).resolves.toEqual(expected);
      expect(redisMock.get).toBeCalledWith(cacheKey);
      expect(repositoryMock.createQueryBuilder).not.toHaveBeenCalled();
    });

    it('should return all teams from db if no cache', async () => {
      // ARRANGE
      const dates = ['2023-01-18T17:00:00.000Z', '2023-01-17T17:00:00.000Z'];

      jest.spyOn(redisMock, 'get').mockResolvedValueOnce(null);
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(() => dates.map((d) => ({ date: d }))),
      };
      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilder);

        // ACT & ASSERT
      expect(matchesService.getCalendar(dto)).resolves.toEqual({ dates });
    });

    it('should cache data for next call', async () => {
      // ARRANGE
      jest.spyOn(redisMock, 'get').mockResolvedValueOnce(undefined);
      jest.spyOn(redisMock, 'set').mockResolvedValueOnce(undefined);
      const queryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(() => []),
      };
      jest
        .spyOn(repositoryMock, 'createQueryBuilder')
        .mockReturnValueOnce(queryBuilder);

      // ACT
      await matchesService.getCalendar(dto);

      // ASSERT
      expect(redisMock.set).toBeCalledTimes(1);
    });
  });
});
