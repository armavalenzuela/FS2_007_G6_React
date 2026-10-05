import { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import categorias from '../../data/Categorias'

function CatalogFilters({ filtros, onChange, onLimpiar, totalResultados }) {
  const [textoLocal, setTextoLocal] = useState(filtros.texto)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (textoLocal !== filtros.texto) {
        onChange({ ...filtros, texto: textoLocal })
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [textoLocal, filtros, onChange])

  function actualizarCampo(campo, valor) {
    onChange({ ...filtros, [campo]: valor })
  }

  function limpiarTodo() {
    setTextoLocal('')
    onLimpiar()
  }

  return (
    <div className="border rounded p-3 mb-4 bg-light">
      <Form.Label htmlFor="filtro-busqueda">Búsqueda avanzada</Form.Label>
      <Form.Control
        id="filtro-busqueda"
        type="search"
        placeholder="Buscar por nombre o descripción…"
        value={textoLocal}
        onChange={(e) => setTextoLocal(e.target.value)}
        className="mb-3"
      />

      <div className="d-flex flex-column flex-md-row gap-3 align-items-md-end">
        <div className="flex-md-grow-1">
          <Form.Label htmlFor="filtro-categoria">Categoría</Form.Label>
          <Form.Select
            id="filtro-categoria"
            value={filtros.categoria}
            onChange={(e) => actualizarCampo('categoria', e.target.value)}
          >
            <option value="todas">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </Form.Select>
        </div>

        <div className="flex-md-grow-1">
          <Form.Label htmlFor="filtro-tipo">Tipo de torta</Form.Label>
          <Form.Select
            id="filtro-tipo"
            value={filtros.tipo}
            onChange={(e) => actualizarCampo('tipo', e.target.value)}
          >
            <option value="todos">Todas</option>
            <option value="cuadrada">Cuadrada</option>
            <option value="circular">Circular</option>
          </Form.Select>
        </div>

        <div className="flex-md-grow-1">
          <Form.Label htmlFor="filtro-tamaño">Tamaño</Form.Label>
          <Form.Select
            id="filtro-tamaño"
            value={filtros.tamaño}
            onChange={(e) => actualizarCampo('tamaño', e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="personal">Personal</option>
            <option value="mediano">Mediano</option>
            <option value="familiar">Familiar</option>
            <option value="individual">Individual</option>
            <option value="unidad">Unidad</option>
          </Form.Select>
        </div>

        <div>
          <Button variant="secondary" onClick={limpiarTodo}>
            Limpiar filtros
          </Button>
        </div>
      </div>

      <div className="mt-3 text-muted">
        Se encontraron <strong>{totalResultados}</strong> producto
        {totalResultados === 1 ? '' : 's'}
      </div>
    </div>
  )
}

export default CatalogFilters
