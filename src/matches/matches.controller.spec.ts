import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { MockType } from '@app/common/test-utils';
import { SearchMatchesDto } from './dtos/search-matches.dto';
import { SORT_DIRECTION } from '@app/common';
import { GetCalendarDto } from './dtos/get-calendar.dto';

describe('MatchesController', () => {
  let controller: MatchesController;
  let serviceMock: MockType<MatchesService> = {
    search: jest.fn(),
    getCalendar: jest.fn(),
  };
  const uid = 'test-uid';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
      providers: [
        {
          provide: MatchesService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    serviceMock = module.get<MockType<MatchesService>>(MatchesService);
    controller = module.get<MatchesController>(MatchesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('search', () => {
    const request: SearchMatchesDto = {
      tournamentId: 'fake-tournament-id',
      from: new Date('2022-12-14'),
      to: new Date('2022-12-14'),
      page: 1,
      pageSize: 10,
      sortField: 'startAt',
      sortDirection: SORT_DIRECTION.ASC,
    };

    const matches = [
      {
        id: 'fake-match-id',
        tournament: {
          name: 'FIFA World Cup Qatar 2022™',
        },
        homeTeam: {
          name: 'Argentina',
        },
        awayTeam: {
          name: 'Croatia',
        },
        startAt: new Date('2022-12-14'),
        endAt: new Date('2022-12-14'),
        homeTeanScore: 3,
        awayTeamScore: 0,
        createdAt: new Date('2022-12-14'),
        updatedAt: new Date('2022-12-14'),
      },
    ];

    it('should call MatchesService.search once and return matches', async () => {
      // Arrange
      const expected = {
        matches: matches,
        totalMatches: 50,
        hasNext: true,
      };
      jest.spyOn(serviceMock, 'search').mockResolvedValue(expected);

      // Act
      const result = await controller.search(request);

      // Assert
      expect(serviceMock.search).toHaveBeenCalledTimes(1);
      expect(serviceMock.search).toHaveBeenCalledWith(request);
      expect(result).toEqual(expected);
    });

    it('should throw error if request service fail', async () => {
      // Arrange
      jest
        .spyOn(serviceMock, 'search')
        .mockResolvedValue(Promise.reject(new Error('Error')));

      // Act & Assert
      await expect(() => controller.search(request)).rejects.toThrow();
    });
  });

  describe('getCalendar', () => {
    const getCalendarDatesDto: GetCalendarDto = {
      tournamentId: 'fake-tournament-id',
      from: new Date('2022-12-14'),
      to: new Date('2022-12-14'),
      timezone: 'Asia/Ho_Chi_Minh',
    };

    it('should call MatchesService.getCalendar once and return calendar', async () => {
      // Arrange
      jest.spyOn(serviceMock, 'getCalendar').mockResolvedValue([]);

      // Act
      const result = await controller.getCalendar(getCalendarDatesDto);

      // Assert
      expect(serviceMock.getCalendar).toHaveBeenCalledTimes(1);
      expect(serviceMock.getCalendar).toHaveBeenCalledWith(getCalendarDatesDto);
      expect(result).toEqual([]);
    });

    it('should throw error if MatchesService.getCalendar fail', async () => {
      // Arrange
      jest
        .spyOn(serviceMock, 'getCalendar')
        .mockResolvedValue(Promise.reject(new Error('Error')));

      // Act & Assert
      await expect(() =>
        controller.getCalendar(getCalendarDatesDto),
      ).rejects.toThrow();
    });
  });
});
