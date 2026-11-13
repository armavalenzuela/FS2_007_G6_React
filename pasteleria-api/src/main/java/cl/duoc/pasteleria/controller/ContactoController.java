package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.ContactoRequest;
import cl.duoc.pasteleria.model.Contacto;
import cl.duoc.pasteleria.service.ContactoService;
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
@RequestMapping("/api/contactos")
public class ContactoController {
    private final ContactoService service;

    public ContactoController(ContactoService service) {
        this.service = service;
    }

    @GetMapping
    public List<Contacto> list() { return service.list(); }

    @GetMapping("/{id}")
    public Contacto find(@PathVariable("id") Long id) { return service.find(id); }

    @Operation(summary = "Crear un contacto")
    @PostMapping
    public ResponseEntity<Contacto> create(@Valid @RequestBody ContactoRequest input) {
        Contacto saved = service.create(input);
        return ResponseEntity.created(URI.create("/api/contactos/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Contacto update(@PathVariable("id") Long id, @Valid @RequestBody ContactoRequest input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
