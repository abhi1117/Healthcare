import { NextResponse } from "next/server";

interface AccessTokenRequestBody {
  secret_key: string;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Parse the request body
    const body: AccessTokenRequestBody = await req.json();

    const response = await fetch(
      "https://emobilab.in/api-vendor/getAccessToken.php",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "mobi-access": "T7D3-kKXc-vtz0",
          Cookie: "PHPSESSID=875316275e08a077e86078a5654d3e86",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
