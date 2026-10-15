export const METODOS_PAGO = [
  "Webpay (débito / crédito)",
  "Transferencia bancaria",
  "Efectivo contra entrega",
  "Simulación: pago rechazado (demo)",
];

export const METODO_PAGO_RECHAZADO = "Simulación: pago rechazado (demo)";

export function procesarPago({ total, metodo }) {
  return new Promise((resolver) => {
    setTimeout(() => {
      const aprobado = Number.isFinite(total) && total >= 0 && metodo !== METODO_PAGO_RECHAZADO;
      resolver({
        aprobado,
        codigoAutorizacion: aprobado ? "AUT" + Math.floor(100000 + Math.random() * 900000) : null,
      });
    }, 300);
  });
}
