import { httpClient } from "../api/httpClient";

export const pedidoService = {
  async list() { return (await httpClient.get("/v1/pedidos")).data; },
  async find(id) { return (await httpClient.get(`/v1/pedidos/${encodeURIComponent(id)}`)).data; },
  async create(pedido) { return (await httpClient.post("/v1/pedidos", pedido)).data; },
  async update(id, pedido) { return (await httpClient.put(`/v1/pedidos/${encodeURIComponent(id)}`, pedido)).data; },
  async remove(id) { await httpClient.delete(`/v1/pedidos/${encodeURIComponent(id)}`); },
};
