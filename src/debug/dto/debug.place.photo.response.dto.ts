import { IsNumber } from 'class-validator';
import IsCustomString from 'src/common/decorators/is-custom-string';

class DebugPlacePhotoResponseDto {
  @IsCustomString()
  name: string;

  @IsNumber()
  maxWidthPx: number;
}

export default DebugPlacePhotoResponseDto;
