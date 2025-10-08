// app/(auth)/login/LoginForm.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/login/action";

const initialState = { ok: false, message: undefined as string | undefined };

export default function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button type="submit">Log in</button>
      </form>

      {!!state.message && <p style={{ color: "red" }}>{state.message}</p>}
    </div>
  );
}
