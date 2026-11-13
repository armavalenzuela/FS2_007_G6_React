package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.ProductoRequest;
import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.repository.ProductoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProductoService {
    private final ProductoRepository repository;

    public ProductoService(ProductoRepository repository) {
        this.repository = repository;
    }

    public List<Producto> list() {
        return repository.findAll();
    }

    public Producto find(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional
    public Producto create(ProductoRequest input) {
        Producto producto = new Producto(
            input.codigo().strip(),
            input.nombre().strip(),
            input.categoria().strip(),
            input.precio(),
            input.stock()
        );
        producto.setDescripcion(input.descripcion() == null ? null : input.descripcion().strip());
        producto.setEnOferta(input.enOferta() == null ? false : input.enOferta());
        producto.setDescuentoOferta(input.descuentoOferta() == null ? 0 : input.descuentoOferta());
        producto.setImagen(input.imagen());
        return repository.save(producto);
    }

    @Transactional
    public Producto update(Long id, ProductoRequest input) {
        Producto producto = find(id);
        producto.setCodigo(input.codigo().strip());
        producto.setNombre(input.nombre().strip());
        producto.setCategoria(input.categoria().strip());
        producto.setPrecio(input.precio());
        producto.setStock(input.stock());
        producto.setDescripcion(input.descripcion() == null ? null : input.descripcion().strip());
        producto.setEnOferta(input.enOferta() == null ? false : input.enOferta());
        producto.setDescuentoOferta(input.descuentoOferta() == null ? 0 : input.descuentoOferta());
        producto.setImagen(input.imagen());
        return repository.save(producto);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}
