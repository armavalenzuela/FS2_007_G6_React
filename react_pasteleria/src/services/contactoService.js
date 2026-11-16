import { httpClient } from "../api/httpClient";

export const contactoService = {
  async list() { return (await httpClient.get("/v1/contactos")).data; },
  async find(id) { return (await httpClient.get(`/v1/contactos/${encodeURIComponent(id)}`)).data; },
  async create(contacto) { return (await httpClient.post("/v1/contactos", contacto)).data; },
  async update(id, contacto) { return (await httpClient.put(`/v1/contactos/${encodeURIComponent(id)}`, contacto)).data; },
  async remove(id) { await httpClient.delete(`/v1/contactos/${encodeURIComponent(id)}`); },
};
