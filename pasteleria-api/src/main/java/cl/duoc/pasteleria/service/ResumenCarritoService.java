package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.ProductoRepository;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ResumenCarritoService {
    private static final BigDecimal DESCUENTO_EDAD = new BigDecimal("0.50");
    private static final BigDecimal DESCUENTO_CODIGO = new BigDecimal("0.10");
    private static final ZoneId ZONA_CHILE = ZoneId.of("America/Santiago");

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Item(String codigo, int cantidad) {}

    public record Linea(String codigo, String nombre, BigDecimal precioUnitario, BigDecimal precioLista,
                        int cantidad, BigDecimal subtotal, BigDecimal subtotalLista) {}

    public record Resumen(List<Linea> lineas, BigDecimal subtotal, BigDecimal descuentoOferta,
                          BigDecimal descuentoTortaDuoc, BigDecimal descuentoEdad, BigDecimal descuentoCodigo,
                          BigDecimal totalDescuentos, BigDecimal total) {}

    private final ProductoRepository productos;
    private final UsuarioService usuarios;

    public ResumenCarritoService(ProductoRepository productos, UsuarioService usuarios) {
        this.productos = productos;
        this.usuarios = usuarios;
    }

    public Resumen calcular(List<Item> items, String correo) {
        return calcular(items, correo, false);
    }

    @Transactional
    public Resumen prepararPedido(List<Item> items, String correo) {
        return calcular(items, correo, true);
    }

    private Resumen calcular(List<Item> items, String correo, boolean descontarStock) {
        Map<String, Integer> cantidades = new LinkedHashMap<>();
        for (Item item : items) {
            if (item == null || item.codigo() == null || item.codigo().isBlank() || item.cantidad() <= 0
                    || cantidades.putIfAbsent(item.codigo(), item.cantidad()) != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa los productos y cantidades del carrito.");
            }
        }
        List<Producto> disponibles = List.of();
        if (!cantidades.isEmpty()) {
            disponibles = descontarStock ? productos.findByCodigoInOrderByCodigoAsc(cantidades.keySet())
                : productos.findByCodigoIn(cantidades.keySet());
        }
        Map<String, Producto> porCodigo = disponibles.stream()
            .collect(Collectors.toMap(Producto::getCodigo, Function.identity()));

        Usuario usuario = correo == null ? null : usuarios.findByCorreo(correo);
        List<Linea> lineas = new ArrayList<>();
        BigDecimal subtotal = BigDecimal.ZERO;
        BigDecimal descuentoOferta = BigDecimal.ZERO;
        BigDecimal descuentoDuoc = BigDecimal.ZERO;

        for (var item : cantidades.entrySet()) {
            Producto producto = porCodigo.get(item.getKey());
            if (producto == null) continue;
            if (descontarStock) {
                int restante = producto.getStock() - item.getValue();
                if (restante < 0) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para " + producto.getNombre());
                }
                producto.setStock(restante);
            }
            BigDecimal precio = producto.getPrecio();
            BigDecimal unitario = precioOferta(producto);
            BigDecimal cantidad = BigDecimal.valueOf(item.getValue());
            BigDecimal subtotalLinea = unitario.multiply(cantidad);
            BigDecimal subtotalLista = precio.multiply(cantidad);
            subtotal = subtotal.add(subtotalLista);
            descuentoOferta = descuentoOferta.add(subtotalLista.subtract(subtotalLinea));
            if (usuario != null && "TE001".equals(producto.getCodigo()) && esCorreoDuoc(usuario.getCorreo())) {
                descuentoDuoc = unitario;
            }
            lineas.add(new Linea(producto.getCodigo(), producto.getNombre(), unitario, precio,
                item.getValue(), subtotalLinea, subtotalLista));
        }

        BigDecimal base = subtotal.subtract(descuentoOferta).subtract(descuentoDuoc);
        BigDecimal descuentoEdad = usuario != null && calificaPorEdad(usuario.getFechaNacimiento())
            ? redondear(base.multiply(DESCUENTO_EDAD)).min(base) : BigDecimal.ZERO;
        BigDecimal baseTrasEdad = base.subtract(descuentoEdad);
        BigDecimal descuentoCodigo = usuario != null && Boolean.TRUE.equals(usuario.getCodigoFelices50Aplicado())
            ? redondear(baseTrasEdad.multiply(DESCUENTO_CODIGO)).min(baseTrasEdad) : BigDecimal.ZERO;
        BigDecimal descuentos = descuentoOferta.add(descuentoDuoc).add(descuentoEdad).add(descuentoCodigo);
        return new Resumen(lineas, subtotal, descuentoOferta, descuentoDuoc, descuentoEdad, descuentoCodigo,
            descuentos, subtotal.subtract(descuentos));
    }

    private static BigDecimal precioOferta(Producto producto) {
        Integer porcentaje = producto.getDescuentoOferta();
        if (!Boolean.TRUE.equals(producto.getEnOferta()) || porcentaje == null || porcentaje <= 0) {
            return producto.getPrecio();
        }
        BigDecimal factor = BigDecimal.valueOf(100 - Math.min(porcentaje, 100), 2);
        return redondear(producto.getPrecio().multiply(factor)).min(producto.getPrecio());
    }

    private static BigDecimal redondear(BigDecimal monto) {
        return monto.setScale(0, RoundingMode.HALF_UP);
    }

    private static boolean esCorreoDuoc(String correo) {
        String normalizado = correo.strip().toLowerCase(Locale.ROOT);
        return normalizado.endsWith("@duoc.cl") || normalizado.endsWith("@profesor.duoc.cl");
    }

    private static boolean calificaPorEdad(String fechaNacimiento) {
        if (fechaNacimiento == null || fechaNacimiento.isBlank()) return false;
        try {
            return Period.between(LocalDate.parse(fechaNacimiento.strip()), LocalDate.now(ZONA_CHILE)).getYears() >= 50;
        } catch (DateTimeParseException ex) {
            return false;
        }
    }
}
