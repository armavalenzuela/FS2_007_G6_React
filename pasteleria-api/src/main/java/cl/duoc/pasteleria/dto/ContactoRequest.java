package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactoRequest(
    @NotBlank(message = "Completa el nombre") String nombre,
    @NotBlank(message = "Completa el correo") @Email(message = "Correo inválido") String correo,
    @NotBlank(message = "Completa el comentario") @Size(max = 500, message = "El comentario admite hasta 500 caracteres") String comentario,
    String fechaEntrega
) {}
