import { useEffect, useRef, useState } from "react";

interface MessageData {
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
      setMessages((prev) => [...prev, JSON.parse(event.data) as MessageData]);
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
