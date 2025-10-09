"use client";

import * as React from "react";
import { useActionState } from "react";
import type { AuthState } from "@/types/Auth";
import { signupAction } from "@/app/(auth)/signup/action";
import AuthSubmitButton from "./AuthSubmitButton";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { Field } from "../UI/Field";
import Link from "next/link";

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
    <div className="w-full">
      <form className="space-y-5" action={formAction} noValidate>
        <Field
          label="Full Name"
          name="full_name"
          type="text"
          placeholder="John Doe"
          required
          defaultValue={state.values?.full_name ?? ""}
          error={nameErr}
          aria-invalid={Boolean(nameErr) || undefined}
          aria-describedby={nameErr ? "full-name-error" : undefined}
          autoComplete="name"
          id="full_name"
        />

        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          defaultValue={state.values?.email ?? ""}
          leftIcon={<EnvelopeIcon className="h-4 w-4" />}
          error={emailErr}
          aria-invalid={Boolean(emailErr) || undefined}
          aria-describedby={emailErr ? "email-error" : undefined}
          autoComplete="email"
          id="email"
        />

        <Field
          label="Password"
          name="password"
          type="password"
          passwordToggle
          placeholder="Your password"
          required
          leftIcon={<LockClosedIcon className="h-4 w-4" />}
          error={passErr}
          aria-invalid={Boolean(passErr) || undefined}
          aria-describedby={passErr ? "password-error" : undefined}
          autoComplete="new-password"
          id="password"
        />

        <Field
          label="Confirm New Password"
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

        <div className="flex items-center justify-center text-sm text-gray-600 pt-1">
          <p>
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[var(--color-cocoBlack,#1a1a1a)] hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </form>

      {!!state.message && (
        <p
          role="status"
          className={`mt-3 text-sm ${
            state.ok ? "text-green-600" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}

      <p className="mt-8 text-xs text-gray-500 text-center leading-relaxed">
        By creating an account, you agree to our{" "}
        <Link href="/privacy" className="text-[#d5c28f] hover:underline font-semibold">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="text-[#d5c28f] hover:underline font-semibold">
          Terms of Service
        </Link>
        .
      </p>
    </div>
  );
}
