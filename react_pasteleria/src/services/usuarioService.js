import { httpClient } from "../api/httpClient";

export const usuarioService = {
  async list() { return (await httpClient.get("/v1/usuarios")).data; },
  async perfil() { return (await httpClient.get("/v1/usuarios/me")).data; },
  async actualizarPerfil(cambios) { return (await httpClient.put("/v1/usuarios/me", cambios)).data; },
  async find(id) { return (await httpClient.get(`/v1/usuarios/${encodeURIComponent(id)}`)).data; },
  async create(usuario) { return (await httpClient.post("/v1/usuarios", usuario)).data; },
  async update(id, usuario) { return (await httpClient.put(`/v1/usuarios/${encodeURIComponent(id)}`, usuario)).data; },
  async remove(id) { await httpClient.delete(`/v1/usuarios/${encodeURIComponent(id)}`); },
};
