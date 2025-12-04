import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RatingResponse } from "@/pages/Index";

const states = [
  { value: "CA", label: "California" },
  { value: "NY", label: "New York" },
  { value: "TX", label: "Texas" },
  { value: "FL", label: "Florida" },
  { value: "IL", label: "Illinois" },
  { value: "PA", label: "Pennsylvania" },
  { value: "OH", label: "Ohio" },
  { value: "GA", label: "Georgia" },
  { value: "NC", label: "North Carolina" },
  { value: "MI", label: "Michigan" },
];

const businessTypes = [
  { value: "retail", label: "Retail" },
  { value: "restaurant", label: "Restaurant" },
  { value: "technology", label: "Technology" },
  { value: "construction", label: "Construction" },
  { value: "healthcare", label: "Healthcare" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "consulting", label: "Consulting" },
  { value: "transportation", label: "Transportation" },
];

interface RatingFormProps {
  onResult: (result: RatingResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function RatingForm({ onResult, isLoading, setIsLoading }: RatingFormProps) {
  const [revenue, setRevenue] = useState("");
  const [state, setState] = useState("");
  const [business, setBusiness] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!revenue || !state || !business) {
      toast.error("Please fill in all fields");
      return;
    }

    const revenueNum = parseFloat(revenue);
    if (isNaN(revenueNum) || revenueNum < 0) {
      toast.error("Please enter a valid revenue amount");
      return;
    }

    setIsLoading(true);
    onResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('rating-engine', {
        body: {
          revenue: revenueNum,
          state,
          business,
        },
      });

      if (error) {
        throw error;
      }

      onResult(data as RatingResponse);
      toast.success("Premium calculated successfully");
    } catch (error) {
      console.error('Error calling rating engine:', error);
      toast.error("Failed to calculate premium. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </span>
          Get a Quote
        </CardTitle>
        <CardDescription>
          Enter your business details to calculate your premium rate
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="revenue">Annual Revenue ($)</Label>
            <Input
              id="revenue"
              type="number"
              placeholder="50000"
              value={revenue}
              onChange={(e) => setRevenue(e.target.value)}
              min="0"
              step="1000"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select value={state} onValueChange={setState}>
              <SelectTrigger id="state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {states.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="business">Business Type</Label>
            <Select value={business} onValueChange={setBusiness}>
              <SelectTrigger id="business">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((b) => (
                  <SelectItem key={b.value} value={b.value}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculating...
              </>
            ) : (
              "Calculate Premium"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
