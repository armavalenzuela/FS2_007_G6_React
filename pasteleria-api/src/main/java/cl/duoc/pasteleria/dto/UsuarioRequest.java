package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UsuarioRequest(
    @NotBlank(message = "Completa el correo") @Email(message = "Correo inválido") String correo,
    @NotBlank(message = "Completa el nombre") String nombre,
    @NotBlank(message = "Completa la contraseña") @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres") String contrasena,
    String tipo,
    String fechaNacimiento,
    String telefono,
    String codigoPromocional
) {}
