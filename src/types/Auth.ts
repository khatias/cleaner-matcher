export type AuthState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Partial<Record<string, string[]>>;
  values?: Partial<{ email: string; full_name: string }>;
  code?: string;
};
