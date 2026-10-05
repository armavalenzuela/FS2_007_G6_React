import { createContext, useContext, useEffect, useState } from 'react'
import { leerStorage, escribirStorage } from '../utils/storage'
import { calcularTotalesPedido } from '../utils/descuentos'

const clavePedidos = 'pasteleria_pedidos'

const OrderContext = createContext(null)

const estadosPedido = ['preparacion', 'empaque', 'en_camino', 'entregado']

const etiquetasEstado = {
  preparacion: 'En preparación',
  empaque: 'En empaque',
  en_camino: 'En camino',
  entregado: 'Entregado',
}

function generarNumeroPedido() {
  const n = Math.floor(Math.random() * 9000) + 1000
  return `PED-${n}`
}

function generarNumeroBoleta() {
  const n = Math.floor(Math.random() * 90000) + 10000
  return `BOL-${n}`
}

export function OrderProvider({ children }) {
  const [pedidos, setPedidos] = useState(() => leerStorage(clavePedidos, []))

  useEffect(() => {
    escribirStorage(clavePedidos, pedidos)
  }, [pedidos])

  function crearPedido({ items, usuario, metodoEntrega, fechaEntregaPreferida, direccion, notas }) {
    const totales = calcularTotalesPedido(items, usuario)
    const ahora = new Date()

    const pedido = {
      id: generarNumeroPedido(),
      boleta: generarNumeroBoleta(),
      fecha: ahora.toISOString(),
      items: totales.itemsFinales,
      itemsOriginales: items,
      subtotal: totales.subtotal,
      montoGratuito: totales.montoGratuito,
      montoDescuento: totales.montoDescuento,
      total: totales.total,
      motivosDescuento: totales.motivos,
      estado: 'preparacion',
      historialEstados: [
        {
          estado: 'preparacion',
          fecha: ahora.toISOString(),
          mensaje: 'Tu pedido fue recibido y está en preparación',
        },
      ],
      metodoEntrega: metodoEntrega || 'delivery',
      fechaEntregaPreferida: fechaEntregaPreferida || '',
      direccion: direccion || '',
      notas: notas || '',
      cliente: usuario
        ? {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            esEstudianteDuoc: usuario.esEstudianteDuoc,
          }
        : null,
    }

    setPedidos((prev) => [pedido, ...prev])
    return pedido
  }

  function avanzarEstadoPedido(idPedido) {
    setPedidos((prev) =>
      prev.map((pedido) => {
        if (pedido.id !== idPedido) return pedido
        const indiceActual = estadosPedido.indexOf(pedido.estado)
        if (indiceActual >= estadosPedido.length - 1) return pedido

        const siguiente = estadosPedido[indiceActual + 1]
        const mensajes = {
          empaque: 'Tu pedido está siendo empaquetado con cuidado',
          en_camino: 'Tu pedido sale hacia tu dirección de entrega',
          entregado: 'Tu pedido fue entregado. ¡Que lo disfrutes!',
        }

        return {
          ...pedido,
          estado: siguiente,
          historialEstados: [
            ...pedido.historialEstados,
            {
              estado: siguiente,
              fecha: new Date().toISOString(),
              mensaje: mensajes[siguiente],
            },
          ],
        }
      }),
    )
  }

  function obtenerPedido(idPedido) {
    return pedidos.find((p) => p.id === idPedido)
  }

  const value = {
    pedidos,
    crearPedido,
    avanzarEstadoPedido,
    obtenerPedido,
    estadosPedido,
    etiquetasEstado,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const contexto = useContext(OrderContext)
  if (!contexto) {
    throw new Error('useOrders debe usarse dentro de OrderProvider')
  }
  return contexto
}
