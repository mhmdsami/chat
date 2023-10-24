import useWebSocket from "~/hooks/use-web-socket";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import type { MetaFunction } from "@remix-run/node";
import type { FormEvent } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Chat | Room" }, { name: "description", content: "Chat!" }];
};

export default function Index() {
  const { ws, messages } = useWebSocket();
  const [draft, setDraft] = useState<string>("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ws?.send(JSON.stringify({ message: draft }));
    setDraft("");
  };

  return (
    <div className="flex flex-col h-[90vh] items-center justify-end gap-5 w-1/3 mx-auto my-4">
      <ScrollArea className="w-full max-h-[80vh]">
        {messages.map(({ message, username }, idx) => (
          <div
            key={idx}
            className="flex flex-col bg-primary w-fit min-w-[35%] p-3 my-2 rounded-lg text-white"
          >
            <p className="text-black text-sm">{username}</p>
            <p>{message}</p>
          </div>
        ))}
      </ScrollArea>
      <form className="flex gap-2 w-full" onSubmit={handleOnSubmit}>
        <Input
          placeholder="Type your message..."
          className="grow"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <Button>
          <Send />
        </Button>
      </form>
    </div>
  );
}
