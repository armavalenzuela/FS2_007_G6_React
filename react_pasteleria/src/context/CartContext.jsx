import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { leerStorage, escribirStorage } from '../utils/storage'

const claveCart = 'pasteleria_cart'
const claveFavoritos = 'pasteleria_favoritos'

const CartContext = createContext(null)

function generarKey(productId, tamaño, mensaje) {
  return `${productId}__${tamaño}__${(mensaje || 'sin-msg').trim().toLowerCase()}`
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => leerStorage(claveCart, []))
  const [favoritos, setFavoritos] = useState(() => leerStorage(claveFavoritos, []))

  useEffect(() => {
    escribirStorage(claveCart, items)
  }, [items])

  useEffect(() => {
    escribirStorage(claveFavoritos, favoritos)
  }, [favoritos])

  function addItem(producto, { tamaño, mensaje = '', precioUnitario, cantidad = 1 } = {}) {
    const key = generarKey(producto.id, tamaño, mensaje)
    setItems((prev) => {
      const existe = prev.find((item) => item.key === key)
      if (existe) {
        return prev.map((item) =>
          item.key === key ? { ...item, cantidad: item.cantidad + cantidad } : item,
        )
      }
      return [
        ...prev,
        {
          key,
          productId: producto.id,
          nombre: producto.nombre,
          categoria: producto.categoria,
          precioUnitario,
          tamaño,
          mensaje: mensaje.trim(),
          cantidad,
          subtotal: precioUnitario * cantidad,
        },
      ]
    })
  }

  function removeItem(key) {
    setItems((prev) => prev.filter((item) => item.key !== key))
  }

  function updateQuantity(key, cantidad) {
    const nuevaCantidad = Math.max(1, cantidad)
    setItems((prev) =>
      prev.map((item) =>
        item.key === key
          ? { ...item, cantidad: nuevaCantidad, subtotal: item.precioUnitario * nuevaCantidad }
          : item,
      ),
    )
  }

  function clearCart() {
    setItems([])
  }

  function toggleFavorito(productId) {
    setFavoritos((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  function esFavorito(productId) {
    return favoritos.includes(productId)
  }

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.cantidad, 0), [items])
  const totalPrice = useMemo(() => items.reduce((acc, item) => acc + item.subtotal, 0), [items])

  const value = {
    items,
    favoritos,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleFavorito,
    esFavorito,
    totalItems,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const contexto = useContext(CartContext)
  if (!contexto) {
    throw new Error('useCart debe usarse dentro de CartProvider')
  }
  return contexto
}
