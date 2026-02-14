import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import IsCustomString from 'src/common/decorators/is-custom-string';
import { toJSON } from 'src/common/utils/json.utils';

class UploadFileOptionsDto {
  @IsOptional()
  @IsBoolean()
  full_url?: boolean;
}

class UploadFileDto {
  @IsCustomString()
  pathPrefix: string;

  @ValidateNested()
  @Type(() => UploadFileOptionsDto)
  @Transform(({ value }) => toJSON(value))
  @IsOptional()
  options?: UploadFileOptionsDto;
}
export default UploadFileDto;
