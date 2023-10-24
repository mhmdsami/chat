import Elysia from "elysia";
import jwt from "@elysiajs/jwt";
import {
  authController,
  userController,
  webSocketController,
} from "./controllers";
import { JWT_SECRET, PORT } from "./utils/config";

const app = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: JWT_SECRET,
    }),
  )
  .use(authController)
  .use(userController)
  .use(webSocketController)
  .listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
