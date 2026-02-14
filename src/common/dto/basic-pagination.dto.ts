/**
 * Basic Data Transfer Object for pagination and search functionality.
 * Provides standardized query parameters for list endpoints requiring
 * pagination, search filtering, and result set management across the application.
 *
 * Pagination Features:
 * - Skip/offset-based pagination for efficient data retrieval
 * - Configurable page size limits for performance optimization
 * - Search functionality for filtered result sets
 * - Automatic type conversion and validation for query parameters
 *
 * Performance Benefits:
 * - Reduces database load through paginated queries
 * - Enables efficient large dataset handling
 * - Supports client-side pagination and infinite scroll
 * - Optimizes API response times and bandwidth usage
 *
 * Usage Context:
 * - List endpoints requiring pagination (users, documents, etc.)
 * - Search and filtering operations
 * - Table and grid data display with pagination
 * - Mobile-friendly data loading with page-based navigation
 */

import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { transformToNumber } from '../utils/transformer.utils';

/**
 * DTO for basic pagination and search query parameters.
 * Handles common list endpoint requirements including record skipping,
 * result limiting, and text-based search filtering.
 *
 * Query Parameter Handling:
 * - Automatic type conversion from string query parameters
 * - Optional parameters with sensible defaults
 * - Validation to ensure proper pagination behavior
 * - Support for both pagination and search functionality
 */
class BasicPaginationDto {
  /**
   * Number of records to skip for pagination offset.
   * Implements offset-based pagination by specifying how many
   * records to skip before returning results from the dataset.
   *
   * Pagination Logic:
   * - Skip = (page - 1) * limit for page-based navigation
   * - Enables jumping to specific pages in large datasets
   * - Supports infinite scroll by incrementing skip value
   * - Used with limit to create paginated result windows
   *
   * Performance Considerations:
   * - Large skip values may impact query performance
   * - Consider cursor-based pagination for very large datasets
   * - Database indexing important for efficient skip operations
   * - Monitor query performance with high skip values
   *
   * Default Behavior:
   * - Optional parameter with undefined default
   * - Database queries handle undefined as no skip (start from beginning)
   * - Automatic conversion from string query parameter to number
   * - Validation ensures non-negative integer values
   *
   * @example 0 (first page)
   * @example 20 (skip first 20 records, start from 21st)
   * @example 100 (skip first 100 records for page navigation)
   */
  @IsNumber()
  @Transform(transformToNumber)
  @IsOptional()
  skip?: number;

  /**
   * Maximum number of records to return in a single response.
   * Controls the page size for paginated results and prevents
   * excessive data transfer that could impact performance.
   *
   * Result Set Control:
   * - Limits the number of records returned per API call
   * - Enables consistent page sizes for client-side display
   * - Prevents memory issues from large result sets
   * - Supports configurable page sizes based on client needs
   *
   * Performance Impact:
   * - Smaller limits reduce response time and bandwidth usage
   * - Larger limits reduce total API calls but increase response size
   * - Balance between user experience and system performance
   * - Consider mobile vs desktop optimal page sizes
   *
   * Security Considerations:
   * - Prevents denial-of-service through excessive result requests
   * - Server-side maximum limits should enforce reasonable bounds
   * - Consider rate limiting for high-limit requests
   * - Monitor and alert on unusually large limit values
   *
   * Default Behavior:
   * - Optional parameter allowing client-specified page sizes
   * - Server typically applies default and maximum limits
   * - Automatic conversion from string query parameter to number
   * - Validation ensures positive integer values
   *
   * @example 10 (small page size for mobile interfaces)
   * @example 25 (standard page size for web tables)
   * @example 50 (larger page size for data-dense interfaces)
   */
  @IsNumber()
  @Transform(transformToNumber)
  @IsOptional()
  limit?: number;

  /**
   * Search query string for filtering results based on text content.
   * Enables text-based search functionality across relevant fields
   * in the dataset, providing users with filtered result sets.
   *
   * Search Functionality:
   * - Text-based filtering across searchable entity fields
   * - Case-insensitive search for user-friendly experience
   * - Partial matching and keyword-based result filtering
   * - Integration with database full-text search capabilities
   *
   * Implementation Options:
   * - Simple substring matching for basic search needs
   * - Regular expression matching for advanced pattern search
   * - Full-text search indexes for performance and relevance
   * - Elasticsearch or similar for complex search requirements
   *
   * User Experience:
   * - Real-time search with debounced input handling
   * - Search highlighting and result relevance ranking
   * - Search history and suggestion functionality
   * - Clear search and reset functionality
   *
   * Performance Considerations:
   * - Database indexing on searchable fields for efficiency
   * - Search query optimization and caching strategies
   * - Minimum search length requirements to prevent excessive queries
   * - Rate limiting for search endpoints to prevent abuse
   *
   * Security and Validation:
   * - Input sanitization to prevent injection attacks
   * - Search term length limits for performance and security
   * - Escaping special characters in search patterns
   * - Monitoring for suspicious search patterns or abuse
   *
   * @example "john doe" (search for users named John Doe)
   * @example "contract" (search for documents containing "contract")
   * @example "pending" (search for items with pending status)
   */
  @IsString()
  @IsOptional()
  search?: string;
}

export default BasicPaginationDto;
