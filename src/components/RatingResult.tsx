import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RatingResponse } from "@/pages/Index";

interface RatingResultProps {
  result: RatingResponse | null;
  isLoading: boolean;
}

export function RatingResult({ result, isLoading }: RatingResultProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-accent/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Quote Result
        </CardTitle>
        <CardDescription>
          Your calculated insurance premium
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Calculating your premium...</p>
          </div>
        ) : result ? (
          <div className="space-y-6">
            {/* Quote ID */}
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Quote ID:</span>
              <span className="font-mono font-semibold text-primary">{result.quoteId}</span>
            </div>

            {/* Premium Display */}
            <div className="text-center py-6 px-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10">
              <p className="text-sm font-medium text-muted-foreground mb-2">Annual Premium</p>
              <p className="text-4xl font-bold text-foreground">
                {formatCurrency(result.premium)}
              </p>
            </div>

            {/* Breakdown */}
            {result.breakdown && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-foreground">Calculation Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="text-sm font-medium">{formatCurrency(result.breakdown.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">State Rate</span>
                    <span className="text-sm font-medium">{result.breakdown.stateMultiplier.toFixed(2)} per $1,000</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Business Multiplier</span>
                    <span className="text-sm font-medium">{result.breakdown.businessMultiplier.toFixed(2)}x</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50 mt-4">
                  <p className="text-xs text-muted-foreground font-mono">
                    Formula: (Revenue / 1000) × State Rate × Business Multiplier
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground">
              Fill out the form to get your quote
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
