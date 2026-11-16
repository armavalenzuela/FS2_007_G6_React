import { httpClient } from "../api/httpClient";

export const productoService = {
  async list() {
    return (await httpClient.get("/v1/productos")).data;
  },
  async find(id) {
    return (await httpClient.get(`/v1/productos/${encodeURIComponent(id)}`)).data;
  },
  async create(producto) {
    return (await httpClient.post("/v1/productos", producto)).data;
  },
  async update(id, producto) {
    return (await httpClient.put(`/v1/productos/${encodeURIComponent(id)}`, producto)).data;
  },
  async remove(id) {
    await httpClient.delete(`/v1/productos/${encodeURIComponent(id)}`);
  },
};
