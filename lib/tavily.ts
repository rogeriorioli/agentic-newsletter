import { tavily } from "@tavily/core";

export async function runDiscovery(country: string, topics: string[]) {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is not defined in the environment variables");
  }

  const tvly = tavily({ apiKey });

  const query = `Latest news about ${topics.join(", ")} in ${country}`;

  try {
    const response = await tvly.search(query, {
      topic: "news",
      days: 3,
      searchDepth: "advanced",
      includeAnswer: true,
      maxResults: 5,
    });

    return response;
  } catch (error) {
    console.error("Error in runDiscovery:", error);
    throw error;
  }
}

