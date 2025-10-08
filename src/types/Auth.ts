export type AuthState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Partial<{ email: string; full_name: string }>;
  code?: string;
};

export type AuthCode =
  | "invalid_credentials"
  | "email_in_use"
  | "email_not_confirmed"
  | "weak_password"
  | "reset_link_invalid_or_expired"
  | "rate_limited"
  | "session_expired"
  | "network"
  | "unknown";