import Elysia from "elysia";

const app = new Elysia()
  .ws("/chat", {
    open: (ws) => {
      console.log("[INFO] Socket Open");
      ws.subscribe("general");
    },
    message: (ws, message) => {
      console.log("[INFO] Socket Message", message);
      ws.publish("general", message);
    },
    close: (ws) => {
      console.log("[INFO] Socket Close");
      ws.unsubscribe("general");
    },
  })
  .listen(5050);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
