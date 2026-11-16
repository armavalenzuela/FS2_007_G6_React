package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
    @NotBlank(message = "Completa el correo") String correo,
    @NotBlank(message = "Completa la contraseña") String contrasena
) {}
