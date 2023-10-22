import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Send } from "lucide-react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [{ title: "Chat | Room" }, { name: "description", content: "Chat!" }];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center py-10">
      <div className="flex gap-2 self-end">
        <Input placeholder="Type your message..." className="w-96" />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
}
