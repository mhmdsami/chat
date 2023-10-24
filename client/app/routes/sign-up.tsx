import { json, redirect } from "@remix-run/node";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Form, Link, useActionData } from "@remix-run/react";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";

type ActionData = {
  message: string;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Chat | Sign Up" },
    { name: "description", content: "Chat!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const token = request.headers.get("Cookie")?.split("=")[1];

  if (token) {
    return redirect("/");
  }

  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return json({ message: "All the field are mandatory" }, { status: 400 });
  }

  const signUpRes = await fetch("http://localhost:5050/auth/sign-up", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (signUpRes.status !== 201) {
    return json(await signUpRes.json(), { status: signUpRes.status });
  }

  const res = await fetch("http://localhost:5050/auth/sign-in", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const {
    data: { accessToken },
  } = await res.json();

  return redirect("/", {
    headers: {
      "Set-Cookie": `token=${accessToken}; Path=/; HttpOnly; SameSite=Lax;`,
    },
  });
};

export default function SignIn() {
  const actionData = useActionData<ActionData>();

  return (
    <Form
      method="POST"
      className="flex flex-col gap-5 h-screen justify-center w-80 mx-auto"
    >
      <h1 className="text-3xl font-bold">Create an Account!</h1>
      <div className="flex flex-col gap-2">
        <Label>Username</Label>
        <Input placeholder="Username" name="username" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Email</Label>
        <Input placeholder="Email" name="email" />
      </div>
      <div className="flex flex-col gap-2">
        <Label>Password</Label>
        <Input placeholder="Password" type="password" name="password" />
      </div>
      <Button type="submit">Sign Up</Button>
      <p className="text-xs text-destructive">{actionData?.message}</p>
      <Link
        to="/sign-in"
        className="text-primary text-sm underline text-center"
      >
        Already have an account? Sign in instead!
      </Link>
    </Form>
  );
}
