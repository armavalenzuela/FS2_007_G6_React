import { httpClient } from "../api/httpClient";

export const pedidoService = {
  async list() { return (await httpClient.get("/pedidos")).data; },
  async find(id) { return (await httpClient.get(`/pedidos/${encodeURIComponent(id)}`)).data; },
  async create(pedido) { return (await httpClient.post("/pedidos", pedido)).data; },
  async update(id, pedido) { return (await httpClient.put(`/pedidos/${encodeURIComponent(id)}`, pedido)).data; },
  async remove(id) { await httpClient.delete(`/pedidos/${encodeURIComponent(id)}`); },
};
