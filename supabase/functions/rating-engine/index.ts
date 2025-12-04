import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// State-based rate factors (per $1000 of revenue)
const stateRates: Record<string, number> = {
  CA: 2.5,
  NY: 2.8,
  TX: 2.0,
  FL: 2.3,
  IL: 2.2,
  PA: 2.1,
  OH: 1.9,
  GA: 2.0,
  NC: 1.8,
  MI: 2.0,
  DEFAULT: 2.0,
};

// Business type multipliers
const businessMultipliers: Record<string, number> = {
  retail: 1.0,
  restaurant: 1.5,
  technology: 0.8,
  construction: 2.0,
  healthcare: 1.3,
  manufacturing: 1.4,
  consulting: 0.7,
  transportation: 1.6,
  DEFAULT: 1.0,
};

interface RatingRequest {
  revenue: number;
  state: string;
  business: string;
}

interface RatingResponse {
  premium: number;
  breakdown?: {
    baseRate: number;
    stateMultiplier: number;
    businessMultiplier: number;
    revenue: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body: RatingRequest = await req.json();
    
    console.log('Rating request received:', JSON.stringify(body));

    // Validate required fields
    if (body.revenue === undefined || body.revenue === null) {
      return new Response(
        JSON.stringify({ error: 'Revenue is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.state) {
      return new Response(
        JSON.stringify({ error: 'State is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!body.business) {
      return new Response(
        JSON.stringify({ error: 'Business type is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate revenue is a positive number
    if (typeof body.revenue !== 'number' || body.revenue < 0) {
      return new Response(
        JSON.stringify({ error: 'Revenue must be a positive number' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stateUpper = body.state.toUpperCase();
    const businessLower = body.business.toLowerCase();

    // Get rate factors
    const stateRate = stateRates[stateUpper] ?? stateRates.DEFAULT;
    const businessMultiplier = businessMultipliers[businessLower] ?? businessMultipliers.DEFAULT;

    // Calculate premium: (revenue / 1000) * stateRate * businessMultiplier
    const premium = Math.round((body.revenue / 1000) * stateRate * businessMultiplier * 100) / 100;

    console.log('Premium calculated:', premium, 'for state:', stateUpper, 'business:', businessLower);

    const response: RatingResponse = {
      premium,
      breakdown: {
        baseRate: stateRate,
        stateMultiplier: stateRate,
        businessMultiplier,
        revenue: body.revenue,
      },
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing rating request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
