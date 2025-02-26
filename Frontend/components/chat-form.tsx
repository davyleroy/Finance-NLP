"use client";

import { cn } from "@/lib/utils";

type CreateMessage = {
  content: string;
  role: "user" | "assistant";
};
import { useChat } from "ai/react";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AutoResizeTextarea } from "@/components/autoresize-textarea";

export function ChatForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { messages, input, setInput, append } = useChat({
    api: "/api/chat",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: CreateMessage = { content: input, role: "user" };
    append(userMessage);
    setInput("");

    // Send the user message to the backend API
    const response = await fetch("http://127.0.0.1:8000/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_input: input }),
    });

    if (response.ok) {
      const data = await response.json();
      const botMessage: CreateMessage = {
        content: data.bot_response,
        role: "assistant",
      };
      append(botMessage);
    } else {
      console.error("Failed to fetch response from API");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const messageList = (
    <div className="my-4 flex h-fit min-h-full flex-col gap-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col",
            message.role === "user" ? "items-end" : "items-start"
          )}
        >
          {message.content && (
            <div
              data-role={message.role}
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-base data-[role=assistant]:bg-gray-50 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
            >
              {message.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <main
      className={cn(
        "ring-none mx-auto flex h-svh max-h-svh w-full max-w-[35rem] flex-col items-stretch border-none",
        className
      )}
      {...props}
    >
      <div className="flex-1 content-center overflow-y-auto px-6">
        {messages.length ? (
          messageList
        ) : (
          <header className="m-auto flex max-w-96 flex-col gap-5 text-center">
            <h1 className="text-2xl font-semibold leading-none tracking-tight">
              AI Chatbot with Generative UI
            </h1>
            <p className="text-muted-foreground text-sm">
              This is an AI Finance chatbot app template built with{" "}
              <span className="text-foreground">Next.js</span>, the{" "}
              <span className="text-foreground">Vercel AI SDK</span>, and{" "}
              <span className="text-foreground">Vercel KV</span>.
            </p>
            <p className="text-muted-foreground text-sm">
              Connected to an API Key Locally and send a message to get started.
              Ask What are the modes through which lululemon serves its guests
              via e-commerce? to test it out!
            </p>
          </header>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-input bg-background focus-within:ring-ring/10 relative mx-6 mb-6 flex items-center rounded-[16px] border px-3 py-1.5 pr-8 text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-0"
      >
        <AutoResizeTextarea
          onKeyDown={handleKeyDown}
          onChange={(v) => setInput(v)}
          value={input}
          placeholder="Enter a message"
          className="placeholder:text-muted-foreground flex-1 bg-transparent focus:outline-none"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute bottom-1 right-1 size-6 rounded-full"
            >
              <ArrowUpIcon size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent sideOffset={12}>Submit</TooltipContent>
        </Tooltip>
      </form>
    </main>
  );
}
