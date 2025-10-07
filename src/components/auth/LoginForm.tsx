import React from "react";
import { login } from "@/app/(auth)/signup/actions";
function LoginForm() {
  return (
    <div>
      {" "}
      <form>
        <label htmlFor="email">Email:</label>
        <input id="email" name="email" type="email" required />
        <label htmlFor="password">Password:</label>
        <input id="password" name="password" type="password" required />
        <button formAction={login}>Sign up</button>
      </form>
      m
    </div>
  );
}

export default LoginForm;
