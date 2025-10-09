"use client";

import React from "react";
import { useActionState } from "react";
import type { AuthState } from "@/types/Auth";
import { resetAction } from "@/app/(auth)/reset-password/action";
import AuthSubmitButton from "./AuthSubmitButton";
import { Field } from "../UI/Field";
import { LockClosedIcon } from "@heroicons/react/24/outline";

const initialState: AuthState = {
  ok: false,
  message: undefined,
  fieldErrors: undefined,
  values: undefined,
};

export default function ResetPasswordForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(
    resetAction,
    initialState
  );

  const passErr = state.fieldErrors?.password?.[0];
  const confirmErr = state.fieldErrors?.confirm_password?.[0];

  return (
    <div className="w-full">
      <form className="space-y-4" action={formAction} noValidate>
        <Field
          label="New password"
          name="password"
          type="password"
          passwordToggle
          placeholder="Enter a new password"
          required
          leftIcon={<LockClosedIcon className="h-4 w-4" />}
          error={passErr}
          aria-invalid={Boolean(passErr) || undefined}
          aria-describedby={passErr ? "password-error" : undefined}
          autoComplete="new-password"
          id="password"
        />

        <Field
          label="Confirm new password"
          name="confirm_password"
          type="password"
          passwordToggle
          placeholder="Re-enter your new password"
          required
          leftIcon={<LockClosedIcon className="h-4 w-4" />}
          error={confirmErr}
          aria-invalid={Boolean(confirmErr) || undefined}
          aria-describedby={confirmErr ? "confirm-password-error" : undefined}
          autoComplete="new-password"
          id="confirm_password"
        />

        <div className="pt-1 flex justify-center">
          <AuthSubmitButton />
        </div>

        {/* Links row */}
        <div className="flex items-center justify-between text-xs text-gray-700">
          <a
            href="/login"
            className="font-medium text-[var(--color-cocoBlack,#1a1a1a)] hover:underline"
          >
            Back to login
          </a>
          <a
            href="/forgot-password"
            className="text-[#d5c28f] hover:underline"
          >
            Send a new reset link
          </a>
        </div>
      </form>

      {!!state.message && (
        <div
          role="status"
          aria-live="polite"
          className={`mt-4 rounded-md border px-3 py-2 text-sm ${
            state.ok
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {state.message}
        </div>
      )}
    </div>
  );
}
