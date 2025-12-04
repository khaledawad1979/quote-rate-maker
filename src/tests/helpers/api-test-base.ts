/**
 * Base API Test Helper
 * Provides reusable methods for testing Edge Functions
 */

import { supabase } from "@/integrations/supabase/client";

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  status: number;
}

export interface RatingRequest {
  revenue?: number | string | null;
  state?: string | null;
  business?: string | null;
}

export interface RatingResponse {
  premium: number;
  quoteId: string;
  breakdown?: {
    baseRate: number;
    stateMultiplier: number;
    businessMultiplier: number;
    revenue: number;
  };
}

export interface ErrorResponse {
  error: string;
}

export class ApiTestBase {
  protected functionName: string;

  constructor(functionName: string) {
    this.functionName = functionName;
  }

  /**
   * Invoke the edge function with given body
   */
  async invoke<T>(body: unknown): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase.functions.invoke<T>(this.functionName, {
        body,
      });

      if (error) {
        return {
          data: null,
          error: new Error(error.message),
          status: 400,
        };
      }

      return {
        data,
        error: null,
        status: 200,
      };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err : new Error(String(err)),
        status: 500,
      };
    }
  }

  /**
   * Helper to make a rating request
   */
  async getRating(request: RatingRequest): Promise<ApiResponse<RatingResponse | ErrorResponse>> {
    return this.invoke<RatingResponse | ErrorResponse>(request);
  }

  /**
   * Calculate expected premium based on known rate factors
   */
  calculateExpectedPremium(revenue: number, state: string, business: string): number {
    const stateRates: Record<string, number> = {
      CA: 2.5, NY: 2.8, TX: 2.0, FL: 2.3, IL: 2.2,
      PA: 2.1, OH: 1.9, GA: 2.0, NC: 1.8, MI: 2.0, DEFAULT: 2.0,
    };

    const businessMultipliers: Record<string, number> = {
      retail: 1.0, restaurant: 1.5, technology: 0.8, construction: 2.0,
      healthcare: 1.3, manufacturing: 1.4, consulting: 0.7, transportation: 1.6, DEFAULT: 1.0,
    };

    const stateRate = stateRates[state.toUpperCase()] ?? stateRates.DEFAULT;
    const businessMultiplier = businessMultipliers[business.toLowerCase()] ?? businessMultipliers.DEFAULT;

    return Math.round((revenue / 1000) * stateRate * businessMultiplier * 100) / 100;
  }
}
