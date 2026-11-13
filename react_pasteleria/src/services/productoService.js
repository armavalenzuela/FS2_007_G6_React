import { httpClient } from "../api/httpClient";

export const productoService = {
  async list() {
    return (await httpClient.get("/productos")).data;
  },
  async find(id) {
    return (await httpClient.get(`/productos/${encodeURIComponent(id)}`)).data;
  },
  async create(producto) {
    return (await httpClient.post("/productos", producto)).data;
  },
  async update(id, producto) {
    return (await httpClient.put(`/productos/${encodeURIComponent(id)}`, producto)).data;
  },
  async remove(id) {
    await httpClient.delete(`/productos/${encodeURIComponent(id)}`);
  },
};
