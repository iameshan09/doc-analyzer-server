/**
 * Common Data Transfer Objects for URL parameter validation containing MongoDB ObjectIds.
 * Provides standardized validation for route parameters that include database identifiers,
 * ensuring proper format validation and type safety across API endpoints.
 *
 * Parameter Validation Features:
 * - MongoDB ObjectId format validation for database references
 * - Custom string validation for additional format requirements
 * - Reusable DTOs for consistent parameter handling across controllers
 * - Type safety and automatic validation in NestJS route handlers
 *
 * Usage Context:
 * - REST API route parameters requiring database ID validation
 * - Nested route parameters with multiple ID requirements
 * - Consistent parameter validation across different modules
 * - Integration with NestJS validation pipeline and decorators
 */

import { IsMongoId } from 'class-validator';
import IsCustomString from '../decorators/is-custom-string';

/**
 * DTO for route parameters containing a single MongoDB ObjectId.
 * Validates URL parameters that reference database entities by their unique identifier,
 * ensuring proper ObjectId format and custom string validation requirements.
 *
 * Common Usage:
 * - GET /api/resource/:id routes for entity retrieval
 * - PUT /api/resource/:id routes for entity updates
 * - DELETE /api/resource/:id routes for entity deletion
 * - Any single-entity operation requiring ID parameter validation
 *
 * Validation Benefits:
 * - Prevents invalid ObjectId formats from reaching business logic
 * - Ensures consistent ID validation across all endpoints
 * - Provides clear error messages for malformed parameters
 * - Integrates with NestJS parameter decoration and validation
 */
class IdIncludedParamDto {
  /**
   * MongoDB ObjectId parameter from URL path for entity identification.
   * Validates that the provided ID parameter is a properly formatted
   * MongoDB ObjectId and meets custom string validation requirements.
   *
   * ObjectId Validation:
   * - Must be a valid 24-character hexadecimal MongoDB ObjectId
   * - Ensures database query compatibility and safety
   * - Prevents NoSQL injection through malformed ID parameters
   * - Validates ObjectId format before database operations
   *
   * Parameter Usage:
   * - Extracted from URL path parameters (e.g., /api/users/:id)
   * - Used for entity lookup and database queries
   * - Provides type-safe access to entity identifiers
   * - Enables consistent ID parameter handling across endpoints
   *
   * Error Handling:
   * - Automatic validation failure for invalid ObjectId formats
   * - Clear error messages for client-side debugging
   * - Prevents downstream errors from malformed identifiers
   * - Integrates with global exception handling and response formatting
   *
   * @example "507f1f77bcf86cd799439011"
   * @example "60b5d8f5c8a1c84d8c8e4f5a"
   */
  @IsMongoId()
  @IsCustomString()
  id: string;
}

/**
 * DTO for route parameters containing two MongoDB ObjectIds.
 * Extends single ID validation to handle endpoints requiring multiple
 * database entity references in the URL path parameters.
 *
 * Common Usage:
 * - Relationship endpoints: GET /api/users/:id/posts/:id2
 * - Nested resource operations: PUT /api/organizations/:id/members/:id2
 * - Association endpoints: POST /api/groups/:id/permissions/:id2
 * - Any dual-entity operation requiring two ID parameter validation
 *
 * Inheritance Benefits:
 * - Inherits primary ID validation from IdIncludedParamDto
 * - Consistent validation behavior across single and dual ID endpoints
 * - Shared validation logic and error handling patterns
 * - Simplified maintenance and consistent API behavior
 */
class DualIdsInParamDto extends IdIncludedParamDto {
  /**
   * Second MongoDB ObjectId parameter from URL path for related entity identification.
   * Validates the second ID parameter in dual-entity operations, typically
   * representing a related or nested resource within the primary entity context.
   *
   * Secondary ID Usage:
   * - References related entities in hierarchical operations
   * - Enables complex resource relationship management
   * - Supports nested resource CRUD operations
   * - Facilitates entity association and relationship endpoints
   *
   * Validation Consistency:
   * - Same validation rules as primary ID parameter
   * - MongoDB ObjectId format requirement
   * - Custom string validation for additional security
   * - Consistent error handling and response patterns
   *
   * Route Examples:
   * - /api/users/:id/profiles/:id2 (user profile management)
   * - /api/projects/:id/tasks/:id2 (project task operations)
   * - /api/organizations/:id/departments/:id2 (organizational hierarchy)
   *
   * @example "507f1f77bcf86cd799439011"
   * @example "60b5d8f5c8a1c84d8c8e4f5a"
   */
  @IsMongoId()
  @IsCustomString()
  id2: string;
}

class StringIdIncludedParamDto {
  @IsCustomString()
  id: string;
}

export { DualIdsInParamDto, IdIncludedParamDto, StringIdIncludedParamDto };
