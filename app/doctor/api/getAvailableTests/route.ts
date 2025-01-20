import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body: { access_token: string } = await request.json();
    const { access_token } = body;

    if (!access_token) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 }
      );
    }

    /*const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // Timeout set to 30 seconds
    */
    const response = await fetch(
      "https://emobilab.in/api-vendor/getAvailableTests.php",
      {
        method: "POST",
        headers: {
          "mobi-access": access_token,
          "Content-Type": "application/json",
        },
        
      }
    );
  
    if (!response.ok) {
      console.error(`API error: ${response.status} - ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch tests: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data: { tests: Array<{ test_id: string; test_name: string }> } =
      await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return NextResponse.json(
        { error: "Request timed out. Please try again later." },
        { status: 504 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
