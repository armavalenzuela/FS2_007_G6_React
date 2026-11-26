package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.service.CarritoService;
import cl.duoc.pasteleria.service.ResumenCarritoService;
import cl.duoc.pasteleria.service.ResumenCarritoService.Item;
import cl.duoc.pasteleria.service.ResumenCarritoService.Resumen;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/carrito")
public class CarritoController {
    private final CarritoService service;

    private final ResumenCarritoService resumenService;

    public CarritoController(CarritoService service, ResumenCarritoService resumenService) {
        this.service = service;
        this.resumenService = resumenService;
    }

    @PostMapping("/resumen")
    public Resumen resumen(Authentication auth, @RequestBody List<Item> items) {
        return resumenService.calcular(items, auth == null ? null : auth.getName());
    }

    @GetMapping
    public ResponseEntity<String> get(Authentication auth) {
        if (auth == null) return ResponseEntity.ok("[]");
        return ResponseEntity.ok(service.getItems(auth.getName()));
    }

    @PutMapping
    public ResponseEntity<String> save(Authentication auth, @RequestBody Map<String, Object> body) {
        if (auth == null) return ResponseEntity.ok("[]");
        String items = body == null ? "[]" : String.valueOf(body.getOrDefault("items", "[]"));
        return ResponseEntity.ok(service.save(auth.getName(), items));
    }

    @DeleteMapping
    public ResponseEntity<Void> clear(Authentication auth) {
        if (auth != null) service.clear(auth.getName());
        return ResponseEntity.noContent().build();
    }
}
