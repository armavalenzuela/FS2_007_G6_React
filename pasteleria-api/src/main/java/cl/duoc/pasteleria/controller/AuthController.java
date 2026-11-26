package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.AuthResponse;
import cl.duoc.pasteleria.dto.LoginRequest;
import cl.duoc.pasteleria.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @Operation(summary = "Iniciar sesiǭn y obtener JWT")
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest input) {
        return service.login(input);
    }

    @Operation(summary = "Renovar JWT (refresh)")
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token requerido");
        }
        AuthResponse refreshed = service.refresh(header.substring(7));
        return ResponseEntity.ok(refreshed);
    }
}
