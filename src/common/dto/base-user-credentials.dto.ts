import IsCustomString from 'src/common/decorators/is-custom-string';

class BaseUserCredentialsDto {
  @IsCustomString({ lowercase: true })
  email: string;

  @IsCustomString()
  password: string;
}

export default BaseUserCredentialsDto;
