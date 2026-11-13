package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record ProductoRequest(
    @NotBlank(message = "Completa el código") String codigo,
    @NotBlank(message = "Completa el nombre") String nombre,
    @NotBlank(message = "Completa la categoría") String categoria,
    @NotNull(message = "Completa el precio") @PositiveOrZero(message = "El precio no puede ser negativo") BigDecimal precio,
    @NotNull(message = "Completa el stock") @PositiveOrZero(message = "El stock no puede ser negativo") Integer stock,
    String descripcion,
    Boolean enOferta,
    Integer descuentoOferta,
    String imagen
) {}
