"use client";

import React from "react";
import { useActionState } from "react";
import type { AuthState } from "@/types/Auth";
import { resetAction } from "@/app/(auth)/reset-password/action";
import AuthSubmitButton from "./AuthSubmitButton";
import FieldError from "./FieldError";
const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

function ResetPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(resetAction, initialState);

const passErr = state.fieldErrors?.password?.[0];
  const confirmErr = state.fieldErrors?.confirm_password?.[0];


  return (
    <div>
      <form action={formAction} noValidate>
        <label htmlFor="password">New Password</label>
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


        <label htmlFor="confirm_password">Confirm New Password</label>
       <input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          aria-invalid={!!confirmErr}
          aria-describedby={confirmErr ? "confirm-password-error" : undefined}
          required
        />
        <FieldError id="confirm-error" msg={confirmErr} />

        <div><AuthSubmitButton /></div>
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

export default ResetPasswordForm;
