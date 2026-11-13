import { httpClient } from "../api/httpClient";

export const usuarioService = {
  async list() { return (await httpClient.get("/usuarios")).data; },
  async find(id) { return (await httpClient.get(`/usuarios/${encodeURIComponent(id)}`)).data; },
  async create(usuario) { return (await httpClient.post("/usuarios", usuario)).data; },
  async update(id, usuario) { return (await httpClient.put(`/usuarios/${encodeURIComponent(id)}`, usuario)).data; },
  async remove(id) { await httpClient.delete(`/usuarios/${encodeURIComponent(id)}`); },
};
