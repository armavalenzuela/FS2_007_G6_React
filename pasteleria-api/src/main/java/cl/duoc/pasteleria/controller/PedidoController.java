package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.PedidoRequest;
import cl.duoc.pasteleria.model.Pedido;
import cl.duoc.pasteleria.service.PedidoService;
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
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Pedido> list() { return service.list(); }

    @GetMapping("/{id}")
    public Pedido find(@PathVariable("id") Long id) { return service.find(id); }

    @Operation(summary = "Crear un pedido")
    @PostMapping
    public ResponseEntity<Pedido> create(@Valid @RequestBody PedidoRequest input) {
        Pedido saved = service.create(input);
        return ResponseEntity.created(URI.create("/api/pedidos/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Pedido update(@PathVariable("id") Long id, @Valid @RequestBody PedidoRequest input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
