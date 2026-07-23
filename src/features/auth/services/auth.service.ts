import { env } from "@/lib/env";

export const authService = {
  async login(_email: string, _password: string) {
    const response = await fetch(`${env.apiBaseUrl}/auth/login`, {
      method: "POST",
    });
    return response.json();
  },
};
