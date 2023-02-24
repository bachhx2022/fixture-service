import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetCalendarDto } from './dtos/get-calendar.dto';
import { SearchMatchesDto } from './dtos/search-matches.dto';
import { MatchesService } from './matches.service';

@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}
  
  @Get()
  @ApiOperation({ summary: 'Get matches' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  search(@Query() dto: SearchMatchesDto) {
    return this.matchesService.search(dto);
  }

  @Get('/calendar')
  @ApiOperation({ summary: 'Get calendar' })
  @ApiResponse({ status: 200, description: 'Ok' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  getCalendar(@Query() dto: GetCalendarDto) {
    return this.matchesService.getCalendar(dto);
  } 
}
