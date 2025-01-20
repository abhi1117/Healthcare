import { oauth2Client } from "@/lib/oauthClient";
import axios from "axios";

export async function GET(request) {
  try {
    // Get the token from the query params
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token"); // Retrieve token from query params

    console.log("We are in list-datasources with token:", token);

    if (!token) {
      return new Response("Token is missing.", { status: 400 });
    }

    // Use the token for authorization
    const accessToken = oauth2Client.credentials?.access_token || token;

    if (!accessToken) {
      return new Response("User not authorized", { status: 401 });
    }

    // Fetch the data sources from Google Fitness API
    const response = await axios.get(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    return new Response(JSON.stringify(response.data), { status: 200 });
  } catch (error) {
    console.error("Error listing data sources:", error.response?.data || error);
    return new Response("Failed to list data sources", { status: 500 });
  }
}
