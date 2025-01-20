// app/api/oauth2callback
import { oauth2Client } from "@/lib/oauthClient";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new Response("Missing authorization code.", { status: 400 });
  }

  try {
    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const { access_token, expiry_date } = tokens;

    if (!access_token || !expiry_date) {
      return new Response("Token or expiry date missing.", { status: 500 });
    }

    // Log token details
    console.log("Tokens:", tokens);

    // Redirect with token and expiry date as query parameters
    const homeUrl = `http://localhost:3000/patient?token=${access_token}&expiry_date=${expiry_date}`;
    return Response.redirect(homeUrl, 302);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    return new Response("Failed to exchange authorization code.", {
      status: 500,
    });
  }
}
