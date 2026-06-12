import { NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // Read the incoming request body
    const body = await req.json();

    // Forward the request to the local n8n instance
    const n8nUrl = "http://localhost:5678/webhook-test/a9522953-456a-4ef3-a922-eed6c5a0b25f";
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const n8nResponse = await fetch(n8nUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    // We need to merge the CORS headers with the n8n response headers
    const responseHeaders = new Headers(n8nResponse.headers);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      responseHeaders.set(key, value);
    });

    // Return the response stream directly so that SSE works
    return new Response(n8nResponse.body, {
      status: n8nResponse.status,
      headers: responseHeaders,
    });
    
  } catch (error: any) {
    console.error("Webhook proxy error:", error);
    return NextResponse.json(
      { error: "Failed to contact n8n webhook", details: error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}
