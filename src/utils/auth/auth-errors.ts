// utils/auth-messages.ts
export type AuthOp = "login" | "signup" | "forgot" | "reset";
import { AuthCode } from "../../types/Auth";


const ANTI_ENUMERATION = true;


export function mapSupabaseErrorToCode(status?: number, message?: string): AuthCode {
  const msg = (message ?? "").toLowerCase();

  if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
    return "invalid_credentials";
  }
  if (msg.includes("email not confirmed")) {
    return "email_not_confirmed";
  }
  if (msg.includes("user already registered") || msg.includes("email already registered")) {
    return "email_in_use";
  }
  if (msg.includes("rate") || msg.includes("too many requests")) {
    return "rate_limited";
  }
  if (msg.includes("expired") || msg.includes("invalid token") || msg.includes("reset link")) {
    return "reset_link_invalid_or_expired";
  }
  if (msg.includes("refresh_token not found") || msg.includes("session not found")) {
    return "session_expired";
  }
  if (status && status >= 500) {
    return "network";
  }
  return "unknown";
}


export function userMessageFor(op: AuthOp, code: AuthCode): string {
  // Anti-enumeration guardrails for sensitive ops
  if (ANTI_ENUMERATION && op === "login") {
    return "Email or password is incorrect. Please try again.";
  }
  if (ANTI_ENUMERATION && op === "forgot") {
    return "If that email exists, we’ve sent a password reset link.";
  }

  switch (op) {
    case "login": {
      switch (code) {
        case "invalid_credentials":
          return "Email or password is incorrect. Please try again.";
        case "email_not_confirmed":
          return "Please verify your email, then try signing in.";
        case "rate_limited":
          return "Too many attempts. Please wait a moment and try again.";
        case "network":
          return "We couldn’t reach the server. Check your connection and try again.";
        case "session_expired":
          return "Your session expired. Please sign in again.";
        default:
          return "We couldn’t sign you in. Please try again.";
      }
    }
    case "signup": {
      switch (code) {
        case "email_in_use":
          return "This email is already registered. Try logging in or resetting your password.";
        case "weak_password":
          return "Your password is too weak. Use at least 8 characters with letters, a number, and a symbol.";
        case "rate_limited":
          return "Too many attempts. Please wait a moment and try again.";
        case "network":
          return "We couldn’t create your account. Check your connection and try again.";
        default:
          return "We couldn’t create your account. Please try again.";
      }
    }
    case "forgot": {

      if (!ANTI_ENUMERATION && code === "rate_limited") {
        return "Too many reset requests. Please wait a moment and try again.";
      }
      return "If that email exists, we’ve sent a password reset link.";
    }
    case "reset": {
      switch (code) {
        case "reset_link_invalid_or_expired":
          return "Your reset link is invalid or has expired. Request a new link.";
        case "weak_password":
          return "Your new password doesn’t meet the requirements. Please try again.";
        case "network":
          return "We couldn’t reset your password. Check your connection and try again.";
        default:
          return "We couldn’t reset your password. Please try again.";
      }
    }
    default:
      return "Something went wrong. Please try again.";
  }
}
