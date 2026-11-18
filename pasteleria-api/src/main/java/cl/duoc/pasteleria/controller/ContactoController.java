package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.ContactoRequest;
import cl.duoc.pasteleria.model.Contacto;
import cl.duoc.pasteleria.service.ContactoService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/contactos")
public class ContactoController {
    private final ContactoService service;

    public ContactoController(ContactoService service) {
        this.service = service;
    }

    @Operation(summary = "Crear un contacto")
    @PostMapping
    public ResponseEntity<Contacto> create(@Valid @RequestBody ContactoRequest input) {
        Contacto saved = service.create(input);
        return ResponseEntity.ok(saved);
    }
}