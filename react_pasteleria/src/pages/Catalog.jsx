import { useState, useMemo } from 'react'
import { Container } from 'react-bootstrap'
import CatalogFilters from '../components/organisms/CatalogFilters'
import ProductList from '../components/organisms/ProductList'
import productos from '../data/Productos'

const filtrosIniciales = {
  texto: '',
  categoria: 'todas',
  tipo: 'todos',
  tamaño: 'todos',
}

function Catalog() {
  const [filtros, setFiltros] = useState(filtrosIniciales)

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = filtros.texto.trim().toLowerCase()
      const coincideTexto =
        !texto ||
        producto.nombre.toLowerCase().includes(texto) ||
        producto.descripcion.toLowerCase().includes(texto)

      const coincideCategoria =
        filtros.categoria === 'todas' || producto.categoriaId === filtros.categoria

      const coincideTipo = filtros.tipo === 'todos' || producto.tipo === filtros.tipo

      const coincideTamaño =
        filtros.tamaño === 'todos' ||
        producto.tamañoBase.toLowerCase() === filtros.tamaño

      return coincideTexto && coincideCategoria && coincideTipo && coincideTamaño
    })
  }, [filtros])

  function limpiarFiltros() {
    setFiltros(filtrosIniciales)
  }

  return (
    <Container className="my-4">
      <h1 className="mb-4">Catálogo de productos</h1>

      <CatalogFilters
        filtros={filtros}
        onChange={setFiltros}
        onLimpiar={limpiarFiltros}
        totalResultados={productosFiltrados.length}
      />

      <ProductList productos={productosFiltrados} />
    </Container>
  )
}

export default Catalog
