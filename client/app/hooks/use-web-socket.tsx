import { useEffect, useRef, useState } from "react";

interface MessageData {
  id: number;
  content: string;
  username: string;
}

export default function useWebSocket() {
  const ws = useRef<WebSocket>();
  const [messages, setMessages] = useState<MessageData[]>([]);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5050/chat");

    ws.current.onopen = (event) => {};

    ws.current.onclose = (event) => {};

    ws.current.onmessage = (event: MessageEvent<string>) => {
      const message = JSON.parse(event.data) as MessageData;

      setMessages((prev) => {
        const result = [];
        const map = new Map();
        for (const item of [...prev, message]) {
          if (!map.has(item.id)) {
            map.set(item.id, true);
            result.push({
              id: item.id,
              content: item.content,
              username: item.username,
            });
          }
        }
        return result;
      });
    };

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  return {
    ws: ws.current,
    messages,
  };
}
