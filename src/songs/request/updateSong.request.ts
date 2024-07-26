import {
  IsArray,
  IsDateString,
  IsMilitaryTime,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSongRequest {
  @IsString()
  @IsOptional()
  readonly title: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly artists: string[];

  @IsDateString()
  @IsOptional()
  readonly releasedDate: Date;

  @IsMilitaryTime()
  @IsOptional()
  readonly duration: Date;

  @IsString()
  @IsOptional()
  readonly lyrics: string;
}
