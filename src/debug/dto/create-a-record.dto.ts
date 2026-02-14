import IsCustomString from 'src/common/decorators/is-custom-string';

class CreateARecordDto {
  @IsCustomString()
  subdomain: string;
}

export default CreateARecordDto;
