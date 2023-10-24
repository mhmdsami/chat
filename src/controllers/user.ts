import Elysia from "elysia";
import { db } from "../utils/db";
import { users } from "../schema";
import { eq } from "drizzle-orm";

export const userController = new Elysia({
  name: "user",
  prefix: "/user",
})
  // @ts-ignore
  .get("/", async ({ request, set, jwt }) => {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const userFromToken = await jwt.verify(token);

    if (!userFromToken) {
      set.status = 401;
      return {
        success: false,
        message: "Unauthorized",
        data: null,
      };
    }

    const [user] = await db
      .select({ id: users.id, username: users.username, email: users.email })
      .from(users)
      .where(eq(users.username, userFromToken.username));

    if (!user) {
      set.status = 404;
      return {
        success: false,
        message: "User not found",
        data: null,
      };
    }

    return {
      success: true,
      message: "User found",
      data: {
        user,
      },
    };
  });
