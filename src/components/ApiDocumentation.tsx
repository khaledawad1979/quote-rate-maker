import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const exampleRequest = `{
  "revenue": 50000,
  "state": "CA",
  "business": "retail"
}`;

const exampleResponse = `{
  "premium": 125.00,
  "breakdown": {
    "baseRate": 2.5,
    "stateMultiplier": 2.5,
    "businessMultiplier": 1.0,
    "revenue": 50000
  }
}`;

export function ApiDocumentation() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
            <svg className="w-4 h-4 text-secondary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </span>
          API Documentation
        </CardTitle>
        <CardDescription>
          Integrate the Rating Engine into your applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Endpoint Info */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
            <span className="px-2 py-1 rounded text-xs font-bold bg-primary text-primary-foreground">
              POST
            </span>
            <code className="text-sm font-mono text-foreground">
              /functions/v1/rating-engine
            </code>
          </div>

          {/* Request/Response Examples */}
          <Tabs defaultValue="request" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="request">Request</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>
            <TabsContent value="request" className="mt-4">
              <div className="relative">
                <pre className="p-4 rounded-lg bg-foreground text-background overflow-x-auto text-sm font-mono">
                  <code>{exampleRequest}</code>
                </pre>
              </div>
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium">Parameters</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3 items-start">
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">revenue</code>
                    <span className="text-muted-foreground">Number - Annual business revenue in USD</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">state</code>
                    <span className="text-muted-foreground">String - Two-letter state code (e.g., "CA", "NY")</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">business</code>
                    <span className="text-muted-foreground">String - Business type (e.g., "retail", "technology")</span>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="response" className="mt-4">
              <div className="relative">
                <pre className="p-4 rounded-lg bg-foreground text-background overflow-x-auto text-sm font-mono">
                  <code>{exampleResponse}</code>
                </pre>
              </div>
              <div className="mt-4 space-y-3">
                <h4 className="text-sm font-medium">Response Fields</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex gap-3 items-start">
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">premium</code>
                    <span className="text-muted-foreground">Number - Calculated annual premium amount</span>
                  </div>
                  <div className="flex gap-3 items-start">
                    <code className="px-2 py-0.5 rounded bg-muted font-mono text-xs">breakdown</code>
                    <span className="text-muted-foreground">Object - Detailed calculation breakdown</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Supported Values */}
          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <h4 className="text-sm font-medium mb-3">Supported States</h4>
              <div className="flex flex-wrap gap-1">
                {["CA", "NY", "TX", "FL", "IL", "PA", "OH", "GA", "NC", "MI"].map((state) => (
                  <span key={state} className="px-2 py-1 rounded bg-muted text-xs font-mono">
                    {state}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Business Types</h4>
              <div className="flex flex-wrap gap-1">
                {["retail", "restaurant", "technology", "construction", "healthcare", "manufacturing", "consulting", "transportation"].map((type) => (
                  <span key={type} className="px-2 py-1 rounded bg-muted text-xs font-mono">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
