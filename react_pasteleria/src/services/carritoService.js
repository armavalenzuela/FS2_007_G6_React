import { httpClient } from "../api/httpClient";

export const carritoService = {
  async get() {
    return (await httpClient.get("/v1/carrito")).data;
  },
  async resumen(items) {
    return (await httpClient.post("/v1/carrito/resumen", items)).data;
  },
  async save(items) {
    return (await httpClient.put("/v1/carrito", { items: JSON.stringify(items) })).data;
  },
  async clear() {
    await httpClient.delete("/v1/carrito");
  },
};
