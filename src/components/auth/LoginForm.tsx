"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/(auth)/login/action";
import type { AuthState } from "@/types/Auth";
import AuthSubmitButton from "./AuthSubmitButton";

const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function LoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    loginAction,
    initialState
  );

  const emailErr = state.fieldErrors?.email?.[0];
  const passErr = state.fieldErrors?.password?.[0];

  return (
    <div>
      <form action={formAction} noValidate>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ""}
          aria-invalid={Boolean(emailErr)}
          aria-describedby={emailErr ? "email-error" : undefined}
          autoComplete="email"
          required
        />
        {emailErr && (
          <p id="email-error" role="alert" style={{ color: "crimson" }}>
            {emailErr}
          </p>
        )}

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          aria-invalid={Boolean(passErr)}
          aria-describedby={passErr ? "password-error" : undefined}
          autoComplete="current-password"
          required
        />
        {passErr && (
          <p id="password-error" role="alert" style={{ color: "crimson" }}>
            {passErr}
          </p>
        )}

        <div style={{ marginTop: 12 }}>
          <AuthSubmitButton />
        </div>
      </form>

      {!!state.message && (
        <p
          role="status"
          style={{ color: state.ok ? "green" : "red", marginTop: 12 }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
