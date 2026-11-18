package cl.duoc.pasteleria.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
    @NotNull(message = "Completa el total") @Positive(message = "El total debe ser mayor a cero") BigDecimal total,
    String estado
) {}