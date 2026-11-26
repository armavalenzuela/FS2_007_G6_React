import { httpClient } from "../api/httpClient";

export const authService = {
  async login(correo, contrasena) {
    return (await httpClient.post("/v1/auth/login", { correo, contrasena })).data;
  },
  async refresh() {
    return (await httpClient.post("/v1/auth/refresh")).data;
  },
};
