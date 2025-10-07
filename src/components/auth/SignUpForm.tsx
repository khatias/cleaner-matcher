// app/(auth)/signup/SignUpForm.tsx
"use client";

import * as React from "react";
import { useActionState } from "react";
import { signupAction } from "@/app/(auth)/actions";

const initialState = { ok: false, message: undefined as string | undefined };

export default function SignUpForm() {
  const [state, formAction] = useActionState(signupAction, initialState);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button type="submit">Sign up</button>
      </form>

      {!!state.message && <p style={{ color: "red" }}>{state.message}</p>}
    </div>
  );
}
