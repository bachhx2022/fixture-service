import { SORT_DIRECTION } from '@app/common';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SearchMatchesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public tournamentId: string;

  @ApiProperty({
    default: new Date('2023/01/01').toISOString(),
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  public from: Date;

  @ApiProperty({
    default: new Date('2023/01/31').toISOString(),
  })
  @IsDate()
  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  public to: Date;

  @ApiProperty({
    required: false,
    default: 1,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Transform(({ value }) => (!!value ? parseInt(value) : 1))
  public page: number;

  @ApiProperty({
    required: false,
    default: 20,
  })
  @IsNumber()
  @IsOptional()
  @Expose()
  @Transform(({ value }) => (!!value ? parseInt(value) : 20))
  public pageSize: number;

  @ApiProperty({
    required: false,
    default: 'startAt',
  })
  @IsString()
  @IsOptional()
  @Expose()
  @Transform(({ value }) => (!!value ? value : 'startAt'))
  public sortField: string;

  @ApiProperty({
    required: false,
    default: 'ASC',
  })
  @IsEnum(SORT_DIRECTION)
  @IsOptional()
  @Expose()
  @Transform(({ value }) => (!!value ? value : SORT_DIRECTION.ASC))
  public sortDirection: SORT_DIRECTION;
}
