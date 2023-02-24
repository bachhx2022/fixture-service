import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { SearchMatchesDto } from './dtos/search-matches.dto';
import { Match } from './match.entity';
import { GetCalendarDto } from './dtos/get-calendar.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private matchesRepository: Repository<Match>,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  /**
   ** Summary: The API returns a list of matches based on user search  
   ** Note: The client calculates the is_live attribute based on start_date and end_date. 
      While it is possible to add an is_live column in the database, it would require a process (a job or api) to maintain the column.
  **/
  async search(dto: SearchMatchesDto): Promise<any> {
    // calculate page info
    const skip = (dto.page - 1) * dto.pageSize;
    const take = dto.pageSize;

    // Query data from db
    const [matches, total] = await this.matchesRepository.findAndCount({
      where: {
        startAt: Between(dto.from, dto.to),
        tournamentId: dto.tournamentId,
      },
      order: {
        [dto.sortField]: dto.sortDirection,
      },
      skip,
      take,
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
    });

    return {
      matches: matches,
      totalMatches: total,
      hasNext: skip + matches.length < total,
    };
  }

  /**
   ** Summary: The API returns a list of dates with scheduled matches
   ** Response:
     {
        "dates": [
          "2023-01-01T00:00:00.000Z",
           ...
        ]
      }
   ** Note: The client converts this date to the local timezone to display it to the user.
  **/
  async getCalendar(dto: GetCalendarDto) {
    // calculate cache key for calendar
    const cacheKey = `fixtures#getCalendar#${
      dto.tournamentId
    }#${dto.from.toISOString()}#${dto.to.toISOString()}#${dto.timezone}`;

    // return calendar if cache hit
    let cachedCalendar = await this.redis.get(cacheKey);
    if (cachedCalendar) return cachedCalendar;

    // query database if cache miss
    // group startAt by date (ignore time part) only in a specific timezone
    const timeExp = `("startAt" AT TIME ZONE '${dto.timezone}')::date`;
    const result = await this.matchesRepository
      .createQueryBuilder()
      .where(
        '"tournamentId" = :tournamentId AND "startAt" >= :from AND "startAt" <= :to',
        {
          from: dto.from,
          to: dto.to,
          tournamentId: dto.tournamentId,
        },
      )
      .groupBy(timeExp)
      .select([`${timeExp} as date`])
      .getRawMany();

    const calendar = {
      dates: result.map((m) => m.date)
    };

    // set cache
    await this.redis.set(cacheKey, JSON.stringify(calendar), 'EX', 10);

    return calendar;
  }
}
