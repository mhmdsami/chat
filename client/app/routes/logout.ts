import { redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";

export let action: ActionFunction = ({ request }) =>
  redirect("/", {
    headers: {
      "Set-Cookie": "token=; Max-Age=0; Path=/; HttpOnly; SameSite=Lax",
    },
  });

export let loader: LoaderFunction = () => redirect("/");
