import { httpClient } from "../api/httpClient";

export const contactoService = {
  async list() { return (await httpClient.get("/contactos")).data; },
  async find(id) { return (await httpClient.get(`/contactos/${encodeURIComponent(id)}`)).data; },
  async create(contacto) { return (await httpClient.post("/contactos", contacto)).data; },
  async update(id, contacto) { return (await httpClient.put(`/contactos/${encodeURIComponent(id)}`, contacto)).data; },
  async remove(id) { await httpClient.delete(`/contactos/${encodeURIComponent(id)}`); },
};
