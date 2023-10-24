import Elysia from "elysia";
import { isAuthenticated } from "../middlewares/auth";

export const webSocketController = new Elysia({
  name: "webSockets",
  prefix: "/chat",
})
  .use(isAuthenticated)
  .ws("/", {
    open: (ws) => {
      console.log("[INFO] Socket Open");
      ws.subscribe("general");
    },
    message: (ws, message) => {
      if (!ws.data.data?.username) {
        ws.close();
        return;
      }
      console.log("[INFO] Socket Message", message);
      ws.publish("general", {
        ...(message as Record<string, string>),
        username: ws.data.data.username,
      });
    },
    close: (ws) => {
      console.log("[INFO] Socket Close");
      ws.unsubscribe("general");
    },
  });
