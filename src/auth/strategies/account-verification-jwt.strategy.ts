/**
 * JWT authentication strategy for Role-Based Access Control (RBAC) users.
 * Implements Passport JWT strategy for authenticating both internal and external users
 * with role-based permissions and session management.
 *
 * This strategy handles:
 * - JWT token extraction from Authorization header
 * - Token signature verification using JWT secret
 * - User validation and permission loading
 * - Request context enrichment with authenticated user data
 * - RBAC payload processing for authorization decisions
 */

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { AuthStrategyEnum } from 'src/common/enum/auth.enums';
import AuthService from '../auth.service';
import { MongoPlainJsObject } from 'src/common/types/mongoose.types';
import { UserAccount } from 'src/common/schemas/user-accout.schema';
import EmailVerificationJwtPayload from 'src/common/types/email-verification-jwt-payload';

/**
 * Passport JWT strategy implementation for RBAC-enabled user authentication.
 * Extends PassportStrategy to provide JWT-based authentication with role-based access control.
 *
 * Authentication Flow:
 * 1. Extract JWT token from Authorization Bearer header
 * 2. Verify token signature using configured JWT secret
 * 3. Decode and validate JWT payload structure
 * 4. Retrieve user data and permissions from database
 * 5. Attach authenticated user to request context
 *
 * Used by:
 * - @UseGuards(AuthGuard('rbac_user')) decorated endpoints
 * - Permission-protected routes requiring user authentication
 * - Controllers that need access to authenticated user data
 *
 * @extends PassportStrategy - Passport.js strategy base class
 * @strategy rbac_user - Named strategy identifier for guard usage
 */
@Injectable()
export class AccountVerificationJwtStrategy extends PassportStrategy(
  Strategy,
  AuthStrategyEnum.ACCOUT_VERIFICATION_JWT,
) {
  /**
   * Initializes the RBAC user JWT authentication strategy.
   * Configures Passport JWT strategy with token extraction and verification settings.
   *
   * Configuration:
   * - Token extraction from Authorization Bearer header
   * - JWT signature verification using environment secret
   * - Strategy registration with 'rbac_user' identifier
   *
   * @param config - Configuration service for accessing JWT secret
   * @param authService - Authentication service for user validation
   */
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      /** Extract JWT token from 'Authorization: Bearer <token>' header */
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      /** JWT secret key for token signature verification */
      secretOrKey: config.get<string>('JWT_SECRET') as string,
    });
  }

  /**
   * Validates JWT payload and retrieves authenticated user data.
   * Called automatically by Passport after successful JWT signature verification.
   *
   * Validation Process:
   * 1. Checks payload existence and structure
   * 2. Delegates to AuthService for user lookup and permission loading
   * 3. Returns user object that gets attached to request.user
   *
   * Security Notes:
   * - Payload is already cryptographically verified by Passport
   * - User existence and account status validated by AuthService
   * - Permission groups are populated for authorization decisions
   * - Session ID validated for active session management
   *
   * @param payload - Decoded JWT payload containing user identification and session data
   * @param req - Express request object (available but typically unused)
   * @returns Promise<BaseUserWithPermissionGroups> - Authenticated user with loaded permissions
   * @throws UnauthorizedException - If payload is invalid or user validation fails
   */
  async validate(
    payload: EmailVerificationJwtPayload,
    req: Request,
  ): Promise<MongoPlainJsObject<UserAccount>> {
    return this.authService.validateUserForAccountVerification(payload);
  }
}
