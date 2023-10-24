import Elysia from "elysia";

type UserFromToken = {
  username: string;
  email: string;
};

export const isAuthenticated = new Elysia().derive(
  // @ts-ignore
  async ({ cookie: { token }, jwt }) => {
    const user = await jwt.verify(token.value);
    if (!user)
      return {
        data: null,
      };

    return {
      data: user as UserFromToken,
    };
  },
);
