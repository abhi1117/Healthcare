import { oauth2Client } from "@/lib/oauthClient";

export async function GET() {
  // console.log("auth");
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read", // Read activity data sources
      "https://www.googleapis.com/auth/fitness.location.read", // Read location data sources
      "https://www.googleapis.com/auth/fitness.body.read", // Read body data sources
      "https://www.googleapis.com/auth/fitness.heart_rate.read", // Read heart rate data
      "https://www.googleapis.com/auth/fitness.activity.read", // Read step count data

    ],
    redirect_uri: process.env.REDIRECT_URI,
  });

  // Redirect to the authorization URL
  return Response.redirect(authUrl, 302); // 302 for temporary redirects
}
