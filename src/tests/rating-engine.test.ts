/**
 * Rating Engine API Tests
 * Comprehensive test suite for the rating-engine edge function
 */

import { describe, it, expect, beforeAll } from "vitest";
import { ApiTestBase, RatingResponse, ErrorResponse } from "./helpers/api-test-base";
import { SchemaValidator, RatingResponseSchema } from "./helpers/schema-validators";
import {
  TestDataGenerator,
  validScenarios,
  invalidScenarios,
  edgeCaseScenarios,
} from "./fixtures/rating-test-data";

/**
 * Rating Engine Test Suite
 */
class RatingEngineTestSuite extends ApiTestBase {
  constructor() {
    super("rating-engine");
  }
}

describe("Rating Engine API", () => {
  let api: RatingEngineTestSuite;

  beforeAll(() => {
    api = new RatingEngineTestSuite();
  });

  /**
   * Valid Request Tests
   */
  describe("Valid Requests", () => {
    it.each(validScenarios)("$name", async (scenario) => {
      const response = await api.getRating(scenario.request);

      expect(response.error).toBeNull();
      expect(response.data).not.toBeNull();

      const data = response.data as RatingResponse;
      
      // Verify premium calculation
      if (scenario.expectedPremium !== undefined) {
        expect(data.premium).toBeCloseTo(scenario.expectedPremium, 2);
      }

      // Verify quote ID format
      expect(SchemaValidator.isValidQuoteId(data.quoteId)).toBe(true);
    });

    it("should return consistent premium for same inputs", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      
      const response1 = await api.getRating(request);
      const response2 = await api.getRating(request);

      const data1 = response1.data as RatingResponse;
      const data2 = response2.data as RatingResponse;

      expect(data1.premium).toBe(data2.premium);
    });

    it("should generate unique quote IDs for each request", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const quoteIds = new Set<string>();

      for (let i = 0; i < 5; i++) {
        const response = await api.getRating(request);
        const data = response.data as RatingResponse;
        quoteIds.add(data.quoteId);
      }

      // Most IDs should be unique (very low collision probability)
      expect(quoteIds.size).toBeGreaterThanOrEqual(4);
    });
  });

  /**
   * Invalid Input Tests
   */
  describe("Invalid/Missing Inputs", () => {
    it.each(invalidScenarios)("$name", async (scenario) => {
      const response = await api.getRating(scenario.request);

      const data = response.data as ErrorResponse;
      
      // Verify error response structure
      expect(SchemaValidator.validateErrorResponse(data).valid).toBe(true);
      
      // Verify error message contains expected text
      if (scenario.expectedError) {
        expect(data.error).toContain(scenario.expectedError);
      }
    });

    it("should reject completely empty request", async () => {
      const response = await api.getRating({});
      const data = response.data as ErrorResponse;

      expect(data.error).toBeDefined();
    });
  });

  /**
   * Edge Case Tests
   */
  describe("Edge Cases", () => {
    it.each(edgeCaseScenarios)("$name", async (scenario) => {
      const response = await api.getRating(scenario.request);

      if (scenario.shouldSucceed) {
        const data = response.data as RatingResponse;
        
        if (scenario.expectedPremium !== undefined) {
          expect(data.premium).toBeCloseTo(scenario.expectedPremium, 2);
        }
        
        expect(SchemaValidator.isValidQuoteId(data.quoteId)).toBe(true);
      } else {
        const data = response.data as ErrorResponse;
        expect(data.error).toBeDefined();
        
        if (scenario.expectedError) {
          expect(data.error).toContain(scenario.expectedError);
        }
      }
    });
  });

  /**
   * Response Schema Validation Tests
   */
  describe("Response Schema Validation", () => {
    it("should return response matching RatingResponse schema", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const response = await api.getRating(request);
      const data = response.data as RatingResponse;

      const validation = SchemaValidator.validateRatingResponse(data);
      expect(validation.valid).toBe(true);
    });

    it("should include all required fields in success response", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const response = await api.getRating(request);
      const data = response.data as RatingResponse;

      expect(SchemaValidator.hasRequiredFields(data, ["premium", "quoteId"])).toBe(true);
    });

    it("should include breakdown with correct structure when present", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const response = await api.getRating(request);
      const data = response.data as RatingResponse;

      if (data.breakdown) {
        expect(SchemaValidator.hasRequiredFields(data.breakdown, [
          "baseRate",
          "stateMultiplier",
          "businessMultiplier",
          "revenue",
        ])).toBe(true);

        expect(typeof data.breakdown.baseRate).toBe("number");
        expect(typeof data.breakdown.stateMultiplier).toBe("number");
        expect(typeof data.breakdown.businessMultiplier).toBe("number");
        expect(typeof data.breakdown.revenue).toBe("number");
      }
    });

    it("should have premium as non-negative number", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const response = await api.getRating(request);
      const data = response.data as RatingResponse;

      expect(SchemaValidator.isValidPremium(data.premium)).toBe(true);
    });

    it("should have quoteId matching Q-XXXXX format", async () => {
      const request = { revenue: 50000, state: "CA", business: "retail" };
      const response = await api.getRating(request);
      const data = response.data as RatingResponse;

      expect(data.quoteId).toMatch(/^Q-\d{5}$/);
    });

    it("should validate full response against zod schema", async () => {
      const request = { revenue: 100000, state: "NY", business: "restaurant" };
      const response = await api.getRating(request);
      const data = response.data;

      const result = RatingResponseSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  /**
   * Premium Calculation Verification
   */
  describe("Premium Calculation Accuracy", () => {
    it("should correctly apply state rate factors", async () => {
      const revenue = 100000;
      const business = "retail";

      // Test high-rate state (NY: 2.8)
      const nyResponse = await api.getRating({ revenue, state: "NY", business });
      const nyData = nyResponse.data as RatingResponse;
      expect(nyData.premium).toBe(280);

      // Test low-rate state (NC: 1.8)
      const ncResponse = await api.getRating({ revenue, state: "NC", business });
      const ncData = ncResponse.data as RatingResponse;
      expect(ncData.premium).toBe(180);
    });

    it("should correctly apply business multipliers", async () => {
      const revenue = 100000;
      const state = "TX"; // Rate: 2.0

      // High multiplier (construction: 2.0)
      const constructionResponse = await api.getRating({ revenue, state, business: "construction" });
      const constructionData = constructionResponse.data as RatingResponse;
      expect(constructionData.premium).toBe(400);

      // Low multiplier (consulting: 0.7)
      const consultingResponse = await api.getRating({ revenue, state, business: "consulting" });
      const consultingData = consultingResponse.data as RatingResponse;
      expect(consultingData.premium).toBe(140);
    });

    it("should match expected premium calculation formula", async () => {
      const scenarios = TestDataGenerator.getValidScenarios();

      for (const scenario of scenarios.slice(0, 5)) {
        const response = await api.getRating(scenario.request);
        const data = response.data as RatingResponse;

        const expected = api.calculateExpectedPremium(
          scenario.request.revenue as number,
          scenario.request.state as string,
          scenario.request.business as string
        );

        expect(data.premium).toBeCloseTo(expected, 2);
      }
    });
  });
});
