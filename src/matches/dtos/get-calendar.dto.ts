import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetCalendarDto {
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
    default: 'Asia/Ho_Chi_Minh',
    required: true
  })
  @IsString()
  public timezone: string;
}
