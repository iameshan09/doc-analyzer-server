import { IsEmail, Matches } from 'class-validator';
import { REGEX_PASSWORD } from 'src/common/constants/regexes';
import IsCustomString from 'src/common/decorators/is-custom-string';

// Base DTO for user information validation
class BaseUserDto {
  @IsCustomString()
  firstName: string; // User's first name

  @IsCustomString()
  lastName: string; // User's last name

  @IsEmail()
  @IsCustomString({ lowercase: true }) // Convert to lowercase
  email: string; // User's email address

  @Matches(REGEX_PASSWORD)
  @IsCustomString()
  password: string;
}

export default BaseUserDto;
