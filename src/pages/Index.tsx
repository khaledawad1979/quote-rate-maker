import { useState } from "react";
import { RatingForm } from "@/components/RatingForm";
import { RatingResult } from "@/components/RatingResult";
import { ApiDocumentation } from "@/components/ApiDocumentation";

export interface RatingResponse {
  premium: number;
  breakdown?: {
    baseRate: number;
    stateMultiplier: number;
    businessMultiplier: number;
    revenue: number;
  };
}

const Index = () => {
  const [result, setResult] = useState<RatingResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Rating Engine</h1>
              <p className="text-xs text-muted-foreground">Insurance Premium API</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
            v1.0
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Premium Rating Engine
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Calculate insurance premiums instantly based on revenue, state, and business type.
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Form Section */}
            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <RatingForm 
                onResult={setResult} 
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </div>

            {/* Result Section */}
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <RatingResult result={result} isLoading={isLoading} />
            </div>
          </div>

          {/* API Documentation */}
          <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <ApiDocumentation />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
