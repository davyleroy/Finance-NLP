import { type CoreMessage, StreamingTextResponse } from "ai"
import { tools } from "@/app/lib/tools"

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json()

  const response = await fetch(process.env.CUSTOM_NLP_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CUSTOM_NLP_API_KEY}`,
    },
    body: JSON.stringify({
      messages,
      system:
        "You are a helpful assistant. When asked about the world's shortest hackathon, use the getHackathonInfo tool to provide accurate information.",
      tools,
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  // Assuming your API returns a readable stream
  const stream = response.body

  if (!stream) {
    throw new Error("No stream returned from API")
  }

  return new StreamingTextResponse(stream)
}

