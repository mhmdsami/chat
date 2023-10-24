import useWebSocket from "~/hooks/use-web-socket";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Send } from "lucide-react";
import { useState } from "react";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import type { FormEvent } from "react";

type LoaderData = {
  user: {
    id: number;
    username: string;
    email: string;
  } | null;
};

export const meta: MetaFunction = () => {
  return [{ title: "Chat | Room" }, { name: "description", content: "Chat!" }];
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = request.headers.get("Cookie")?.split("=")[1];
  if (!token) {
    return null;
  }

  const res = await fetch("http://localhost:5050/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    return null;
  }

  const {
    data: { user },
  } = await res.json();
  return json({ user });
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  const { ws, messages } = useWebSocket();
  const [draft, setDraft] = useState<string>("");

  const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    ws?.send(JSON.stringify({ content: draft }));
    setDraft("");
  };

  return (
    <>
      <div className="flex justify-end w-1/2 mx-auto mt-16">
        {data ? (
          <Form method="POST" action="/logout">
            <Button type="submit">Logout</Button>
          </Form>
        ) : (
          <Button>
            <Link to="/sign-in">Sign In</Link>
          </Button>
        )}
      </div>
      <div className="flex flex-col h-[80vh] items-center justify-end gap-5 w-1/3 mx-auto my-4">
        <ScrollArea className="w-full max-h-[70vh]">
          {messages.map(({ content, username }, idx) => (
            <div
              key={idx}
              className={`flex flex-col w-fit min-w-[35%] p-3 my-2 rounded-lg text-white ${data?.user?.username === username ? "bg-secondary" : "bg-primary"}`}
            >
              <p className={`text-sm ${data?.user?.username === username ? "text-primary" : "text-black"}`}>{username}</p>
              <p>{content}</p>
            </div>
          ))}
        </ScrollArea>
        <form className="flex gap-2 w-full" onSubmit={handleOnSubmit}>
          <Input
            placeholder={data ? "Type your message..." : "Sign in to chat!"}
            className="grow"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            disabled={!data}
          />
          <Button>
            <Send />
          </Button>
        </form>
      </div>
    </>
  );
}
