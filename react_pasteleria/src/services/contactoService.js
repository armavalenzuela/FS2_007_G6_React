import { httpClient } from "../api/httpClient";

export const contactoService = {
  async create(contacto) { return (await httpClient.post("/v1/contactos", contacto)).data; },
};