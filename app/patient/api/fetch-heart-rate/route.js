import { oauth2Client } from "@/lib/oauthClient";
import axios from "axios";

export async function POST(request) {
  try {
    // const { searchParams } = new URL(request.url);
    // const token = searchParams.get("token");
    const { token } = await request.json();
    // console.log("fetch-steps-calories-heart with token:", token);

    if (!token) {
      return new Response("Token is missing.", { status: 400 });
    }

    const accessToken = oauth2Client.credentials?.access_token || token;

    if (!accessToken) {
      return new Response("User not authorized", { status: 401 });
    }

    // Fetch available data sources
    const dataSourceResponse = await axios.get(
      "https://www.googleapis.com/fitness/v1/users/me/dataSources",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Filter for relevant data sources
    const stepCountStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.step_count.delta"
    );

    const caloriesStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.calories.expended"
    );

    const heartRateStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.heart_rate.bpm"
    );

    const distanceStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.distance.delta"
    );

    // Fetch data for height and weight
    const heightStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.body.height"
    );

    const weightStreams = dataSourceResponse.data.dataSource.filter(
      (source) => source.dataType.name === "com.google.body.weight"
    );

    if (
      stepCountStreams.length === 0 &&
      caloriesStreams.length === 0 &&
      heartRateStreams.length === 0 &&
      distanceStreams.length === 0 &&
      heightStreams.length === 0 &&
      weightStreams.length === 0
    ) {
      return new Response("No relevant data sources available.", {
        status: 404,
      });
    }

    // Aggregate data for the last 7 days
    const response = await axios.post(
      "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate",
      {
        aggregateBy: [
          ...(stepCountStreams.length > 0
            ? [
                {
                  dataSourceId: stepCountStreams[0].dataStreamId,
                  dataTypeName: "com.google.step_count.delta",
                },
              ]
            : []),
          ...(caloriesStreams.length > 0
            ? [
                {
                  dataSourceId: caloriesStreams[0].dataStreamId,
                  dataTypeName: "com.google.calories.expended",
                },
              ]
            : []),
          ...(heartRateStreams.length > 0
            ? [
                {
                  dataSourceId: heartRateStreams[0].dataStreamId,
                  dataTypeName: "com.google.heart_rate.bpm",
                },
              ]
            : []),
          ...(distanceStreams.length > 0
            ? [
                {
                  dataSourceId: distanceStreams[0].dataStreamId,
                  dataTypeName: "com.google.distance.delta",
                },
              ]
            : []),
          ...(heightStreams.length > 0
            ? [
                {
                  dataSourceId: heightStreams[0].dataStreamId,
                  dataTypeName: "com.google.body.height",
                },
              ]
            : []),
          ...(weightStreams.length > 0
            ? [
                {
                  dataSourceId: weightStreams[0].dataStreamId,
                  dataTypeName: "com.google.body.weight", 
                },
              ]
            : []),
        ],
        bucketByTime: { durationMillis: 86400000 }, // 1 day in milliseconds
        startTimeMillis: Date.now() - 7 * 24 * 60 * 60 * 1000, // Last 7 days
        endTimeMillis: Date.now(),
      },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Process the data
    const activityData = response.data.bucket.map((bucket) => {
      const startTimeMillis = parseInt(bucket.startTimeMillis, 10);
      const endTimeMillis = parseInt(bucket.endTimeMillis, 10);

      const steps =
        bucket.dataset[0]?.point.reduce((sum, point) => {
          return sum + (point.value[0]?.intVal || 0);
        }, 0) || 0;

      const calories =
        bucket.dataset[1]?.point.reduce((sum, point) => {
          return sum + (point.value[0]?.fpVal || 0);
        }, 0) || 0;

      const heartRateData =
        bucket.dataset[2]?.point.map((point) => {
          return {
            bpm: point.value[0]?.fpVal || 0,
            time: new Date(
              parseInt(point.startTimeNanos) / 1e6
            ).toLocaleString(),
          };
        }) || [];

      const distance =
        bucket.dataset[3]?.point.reduce((sum, point) => {
          return sum + (point.value[0]?.fpVal || 0);
        }, 0) || 0;

      const height =
        bucket.dataset[4]?.point.reduce((sum, point) => {
          return sum + (point.value[0]?.fpVal || 0);
        }, 0) || 0;

      const weight =
        bucket.dataset[5]?.point.reduce((sum, point) => {
          return sum + (point.value[0]?.fpVal || 0);
        }, 0) || 0;

      return {
        startTime: !isNaN(startTimeMillis)
          ? new Date(startTimeMillis).toLocaleString()
          : "Invalid Date",
        endTime: !isNaN(endTimeMillis)
          ? new Date(endTimeMillis).toLocaleString()
          : "Invalid Date",
        steps,
        calories: parseFloat(calories.toFixed(2)),
        heartRate: heartRateData,
        distance: (distance / 1000).toFixed(2),
        height: height > 0 ? height.toFixed(2) : "Data not available",
        weight: weight > 0 ? weight.toFixed(2) : "Data not available",
      };
    });

    console.log(activityData);
    return new Response(JSON.stringify(activityData), { status: 200 });
  } catch (error) {
    console.error("Error fetching data:", error.response?.data || error);
    return new Response("Failed to fetch data", { status: 500 });
  }
}
