"use client";

import * as React from "react";
import { useActionState } from "react";
import FieldError from "./FieldError";
import type { AuthState } from "@/app/(auth)/actions";
import { signupAction } from "@/app/(auth)/actions";
import AuthSubmitButton from "./AuthSubmitButton";
const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function SignUpForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    signupAction,
    initialState
  );

  const emailErr = state.fieldErrors?.email?.[0];
  const nameErr = state.fieldErrors?.full_name?.[0];
  const passErr = state.fieldErrors?.password?.[0];
  const confirmErr = state.fieldErrors?.confirm_password?.[0];

  return (
    <div>
      <form action={formAction} noValidate>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ""}
          aria-invalid={!!emailErr}
          aria-describedby={emailErr ? "email-error" : undefined}
          required
        />
        <FieldError id="email-error" msg={emailErr} />

        <label htmlFor="full_name">Full Name:</label>
        <input
          id="full_name"
          name="full_name"
          type="text"
          defaultValue={state.values?.full_name ?? ""}
          aria-invalid={!!nameErr}
          aria-describedby={nameErr ? "full-name-error" : undefined}
          required
        />
        <FieldError id="full-name-error" msg={nameErr} />

        <label htmlFor="password">Password:</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!passErr}
          aria-describedby={passErr ? "password-error" : undefined}
          required
        />
        <FieldError id="password-error" msg={passErr} />

        <label htmlFor="confirm_password">Confirm Password:</label>
        <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!confirmErr}
          aria-describedby={confirmErr ? "confirm-password-error" : undefined}
          required
        />
        <FieldError id="confirm-password-error" msg={confirmErr} />

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
