/**
 * Test Data Management
 * Centralized test fixtures for rating engine tests
 */

import { RatingRequest } from "../helpers/api-test-base";

export interface TestScenario {
  name: string;
  request: RatingRequest;
  expectedPremium?: number;
  shouldSucceed: boolean;
  expectedError?: string;
}

/**
 * Valid request scenarios
 */
export const validScenarios: TestScenario[] = [
  {
    name: "Standard retail business in California",
    request: { revenue: 50000, state: "CA", business: "retail" },
    expectedPremium: 125.0,
    shouldSucceed: true,
  },
  {
    name: "Technology business in Georgia",
    request: { revenue: 80000, state: "GA", business: "technology" },
    expectedPremium: 128.0,
    shouldSucceed: true,
  },
  {
    name: "Restaurant in New York",
    request: { revenue: 100000, state: "NY", business: "restaurant" },
    expectedPremium: 420.0,
    shouldSucceed: true,
  },
  {
    name: "Construction in Texas",
    request: { revenue: 200000, state: "TX", business: "construction" },
    expectedPremium: 800.0,
    shouldSucceed: true,
  },
  {
    name: "Healthcare in Florida",
    request: { revenue: 75000, state: "FL", business: "healthcare" },
    expectedPremium: 224.25,
    shouldSucceed: true,
  },
  {
    name: "Consulting in Ohio (low multiplier state + business)",
    request: { revenue: 150000, state: "OH", business: "consulting" },
    expectedPremium: 199.5,
    shouldSucceed: true,
  },
  {
    name: "Unknown state defaults to DEFAULT rate",
    request: { revenue: 100000, state: "ZZ", business: "retail" },
    expectedPremium: 200.0,
    shouldSucceed: true,
  },
  {
    name: "Unknown business defaults to DEFAULT multiplier",
    request: { revenue: 100000, state: "CA", business: "unknown" },
    expectedPremium: 250.0,
    shouldSucceed: true,
  },
  {
    name: "Case insensitive state (lowercase)",
    request: { revenue: 50000, state: "ca", business: "retail" },
    expectedPremium: 125.0,
    shouldSucceed: true,
  },
  {
    name: "Case insensitive business (uppercase)",
    request: { revenue: 50000, state: "CA", business: "RETAIL" },
    expectedPremium: 125.0,
    shouldSucceed: true,
  },
];

/**
 * Invalid/missing input scenarios
 */
export const invalidScenarios: TestScenario[] = [
  {
    name: "Missing revenue",
    request: { state: "CA", business: "retail" },
    shouldSucceed: false,
    expectedError: "Revenue is required",
  },
  {
    name: "Missing state",
    request: { revenue: 50000, business: "retail" },
    shouldSucceed: false,
    expectedError: "State is required",
  },
  {
    name: "Missing business",
    request: { revenue: 50000, state: "CA" },
    shouldSucceed: false,
    expectedError: "Business type is required",
  },
  {
    name: "Empty state string",
    request: { revenue: 50000, state: "", business: "retail" },
    shouldSucceed: false,
    expectedError: "State is required",
  },
  {
    name: "Empty business string",
    request: { revenue: 50000, state: "CA", business: "" },
    shouldSucceed: false,
    expectedError: "Business type is required",
  },
  {
    name: "Null revenue",
    request: { revenue: null, state: "CA", business: "retail" },
    shouldSucceed: false,
    expectedError: "Revenue is required",
  },
];

/**
 * Edge case scenarios
 */
export const edgeCaseScenarios: TestScenario[] = [
  {
    name: "Zero revenue",
    request: { revenue: 0, state: "CA", business: "retail" },
    expectedPremium: 0,
    shouldSucceed: true,
  },
  {
    name: "Negative revenue",
    request: { revenue: -50000, state: "CA", business: "retail" },
    shouldSucceed: false,
    expectedError: "Revenue must be a positive number",
  },
  {
    name: "Very large revenue",
    request: { revenue: 1000000000, state: "CA", business: "retail" },
    expectedPremium: 2500000.0,
    shouldSucceed: true,
  },
  {
    name: "Decimal revenue",
    request: { revenue: 50000.50, state: "CA", business: "retail" },
    expectedPremium: 125.0,
    shouldSucceed: true,
  },
  {
    name: "Small revenue",
    request: { revenue: 100, state: "CA", business: "retail" },
    expectedPremium: 0.25,
    shouldSucceed: true,
  },
  {
    name: "Revenue as string (invalid type)",
    request: { revenue: "50000" as unknown as number, state: "CA", business: "retail" },
    shouldSucceed: false,
    expectedError: "Revenue must be a positive number",
  },
];

/**
 * All test scenarios combined
 */
export const allScenarios = {
  valid: validScenarios,
  invalid: invalidScenarios,
  edgeCases: edgeCaseScenarios,
};

/**
 * Test data generator for parameterized tests
 */
export class TestDataGenerator {
  static getValidScenarios(): TestScenario[] {
    return validScenarios;
  }

  static getInvalidScenarios(): TestScenario[] {
    return invalidScenarios;
  }

  static getEdgeCaseScenarios(): TestScenario[] {
    return edgeCaseScenarios;
  }

  static getAllScenarios(): TestScenario[] {
    return [...validScenarios, ...invalidScenarios, ...edgeCaseScenarios];
  }

  /**
   * Generate random valid request
   */
  static generateRandomValidRequest(): RatingRequest {
    const states = ["CA", "NY", "TX", "FL", "GA", "OH"];
    const businesses = ["retail", "restaurant", "technology", "construction", "healthcare"];
    return {
      revenue: Math.floor(Math.random() * 500000) + 10000,
      state: states[Math.floor(Math.random() * states.length)],
      business: businesses[Math.floor(Math.random() * businesses.length)],
    };
  }
}
