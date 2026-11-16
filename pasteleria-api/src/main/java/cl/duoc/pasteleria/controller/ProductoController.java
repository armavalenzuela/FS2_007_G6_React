package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.ProductoRequest;
import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Producto> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public Producto find(@PathVariable("id") Long id) {
        return service.find(id);
    }

    @Operation(summary = "Crear un producto")
    @PostMapping
    public ResponseEntity<Producto> create(@Valid @RequestBody ProductoRequest input) {
        Producto saved = service.create(input);
        URI location = URI.create("/api/productos/" + saved.getId());
        return ResponseEntity.created(location).body(saved);
    }

    @PutMapping("/{id}")
    public Producto update(@PathVariable("id") Long id, @Valid @RequestBody ProductoRequest input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
