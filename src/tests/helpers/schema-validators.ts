/**
 * Schema Validators
 * Validate response structure and data types
 */

import { z } from "zod";

/**
 * Schema for successful rating response
 */
export const RatingResponseSchema = z.object({
  premium: z.number().nonnegative(),
  quoteId: z.string().regex(/^Q-\d{5}$/, "Quote ID must match format Q-XXXXX"),
  breakdown: z.object({
    baseRate: z.number().positive(),
    stateMultiplier: z.number().positive(),
    businessMultiplier: z.number().positive(),
    revenue: z.number().nonnegative(),
  }).optional(),
});

/**
 * Schema for error response
 */
export const ErrorResponseSchema = z.object({
  error: z.string().min(1),
});

/**
 * Validator class for schema validation
 */
export class SchemaValidator {
  /**
   * Validate rating response structure
   */
  static validateRatingResponse(data: unknown): { valid: boolean; errors?: string[] } {
    const result = RatingResponseSchema.safeParse(data);
    if (result.success) {
      return { valid: true };
    }
    return {
      valid: false,
      errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
    };
  }

  /**
   * Validate error response structure
   */
  static validateErrorResponse(data: unknown): { valid: boolean; errors?: string[] } {
    const result = ErrorResponseSchema.safeParse(data);
    if (result.success) {
      return { valid: true };
    }
    return {
      valid: false,
      errors: result.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
    };
  }

  /**
   * Check if response has required fields
   */
  static hasRequiredFields(data: unknown, fields: string[]): boolean {
    if (typeof data !== "object" || data === null) return false;
    return fields.every((field) => field in data);
  }

  /**
   * Validate quote ID format
   */
  static isValidQuoteId(quoteId: unknown): boolean {
    return typeof quoteId === "string" && /^Q-\d{5}$/.test(quoteId);
  }

  /**
   * Validate premium is a valid number
   */
  static isValidPremium(premium: unknown): boolean {
    return typeof premium === "number" && !isNaN(premium) && premium >= 0;
  }
}
