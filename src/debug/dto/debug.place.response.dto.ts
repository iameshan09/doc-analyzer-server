import IsCustomString from 'src/common/decorators/is-custom-string';

class DebugPlaceResponseDto {
  @IsCustomString()
  place: string;
}

export default DebugPlaceResponseDto;
