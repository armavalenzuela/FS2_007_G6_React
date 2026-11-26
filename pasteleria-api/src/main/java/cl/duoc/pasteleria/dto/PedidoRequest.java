package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;

public record PedidoRequest(
    @NotBlank(message = "Completa el número") String numero,
    @NotBlank(message = "Completa el correo del cliente") String correoCliente,
    String fecha,
    String envio,
    String metodoPago,
    String codigoAutorizacion,
    String lineas,
    BigDecimal subtotal,
    BigDecimal descuentoTortaDuoc,
    BigDecimal descuentoEdad,
    BigDecimal descuentoCodigo,
    @NotNull(message = "Completa el total") @PositiveOrZero(message = "El total no puede ser negativo") BigDecimal total,
    String estado
) {}