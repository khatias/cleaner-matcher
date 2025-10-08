// app/(auth)/forgot-password/ForgotPasswordForm.tsx
"use client";

import React from "react";
import { useActionState } from "react";
import type { AuthState } from "@/types/Auth";
import { forgotAction } from "@/app/(auth)/forgot-password/action";
import AuthSubmitButton from "./AuthSubmitButton";
const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function ForgotPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    forgotAction,
    initialState
  );

  const emailErr = state.fieldErrors?.email?.[0];

  return (
    <div>
      <form action={formAction} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={state.values?.email ?? ""}
          aria-invalid={Boolean(emailErr)}
          aria-describedby={emailErr ? "email-error" : undefined}
          inputMode="email"
          autoComplete="email"
          required
        />
        {emailErr && (
          <p id="email-error" className="error">
            {emailErr}
          </p>
        )}
        <div>
          <AuthSubmitButton />
        </div>
      </form>
      {state.message && (
        <p
          role="status"
          aria-live="polite"
           style={{ color: state.ok ? "green" : "red", marginTop: 12 }}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
