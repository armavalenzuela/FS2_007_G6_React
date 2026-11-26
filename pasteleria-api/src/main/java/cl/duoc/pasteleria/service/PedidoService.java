package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.PedidoRequest;
import cl.duoc.pasteleria.model.Pedido;
import cl.duoc.pasteleria.repository.PedidoRepository;
import cl.duoc.pasteleria.service.ResumenCarritoService.Item;
import cl.duoc.pasteleria.service.ResumenCarritoService.Resumen;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class PedidoService {
    private final PedidoRepository repository;
    private final ObjectMapper objectMapper;

    private final ResumenCarritoService resumenService;

    public PedidoService(PedidoRepository repository, ObjectMapper objectMapper, ResumenCarritoService resumenService) {
        this.repository = repository;
        this.objectMapper = objectMapper;
        this.resumenService = resumenService;
    }

    public List<Pedido> list() {
        return repository.findAll();
    }

    public List<Pedido> historial(String correo) {
        return repository.findByCorreoClienteIgnoreCaseOrderByFechaDesc(correo.strip());
    }

    public Pedido find(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
    }

    public Pedido findByNumero(String numero) {
        return repository.findByNumero(numero).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
    }

    @Transactional
    public Pedido create(PedidoRequest input, String correoAutenticado) {
        List<Item> items;
        try {
            items = input.lineas() == null ? null : objectMapper.readValue(input.lineas(), new TypeReference<List<Item>>() {});
        } catch (JsonProcessingException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa los productos del pedido.");
        }
        if (items == null || items.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tu carrito está vacío.");
        }

        Resumen resumen = resumenService.prepararPedido(items, correoAutenticado);
        if (resumen.lineas().size() != items.size() || resumen.total().compareTo(input.total()) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El carrito cambió. Revisa el resumen antes de pagar.");
        }

        String correo = correoAutenticado == null ? input.correoCliente() : correoAutenticado;
        Pedido pedido = new Pedido(input.numero().strip(), correo.strip().toLowerCase(Locale.ROOT), resumen.total());
        pedido.setFecha(input.fecha());
        pedido.setEnvio(input.envio());
        pedido.setMetodoPago(input.metodoPago());
        pedido.setCodigoAutorizacion(input.codigoAutorizacion());
        try {
            pedido.setLineas(objectMapper.writeValueAsString(resumen.lineas()));
        } catch (JsonProcessingException ex) {
            throw new IllegalStateException("No se pudieron guardar los productos del pedido.", ex);
        }
        pedido.setSubtotal(resumen.subtotal());
        pedido.setDescuentoOferta(resumen.descuentoOferta());
        pedido.setDescuentoTortaDuoc(resumen.descuentoTortaDuoc());
        pedido.setDescuentoEdad(resumen.descuentoEdad());
        pedido.setDescuentoCodigo(resumen.descuentoCodigo());
        pedido.setEstado(input.estado() == null || input.estado().isBlank() ? "pagado" : input.estado().strip());

        return repository.save(pedido);
    }

    @Transactional
    public Pedido update(Long id, PedidoRequest input) {
        Pedido pedido = find(id);
        pedido.setNumero(input.numero().strip());
        pedido.setCorreoCliente(input.correoCliente().strip().toLowerCase());
        pedido.setFecha(input.fecha());
        pedido.setEnvio(input.envio());
        pedido.setMetodoPago(input.metodoPago());
        pedido.setCodigoAutorizacion(input.codigoAutorizacion());
        pedido.setLineas(input.lineas());
        pedido.setSubtotal(input.subtotal());
        pedido.setDescuentoTortaDuoc(input.descuentoTortaDuoc());
        pedido.setDescuentoEdad(input.descuentoEdad());
        pedido.setDescuentoCodigo(input.descuentoCodigo());
        pedido.setTotal(input.total());
        pedido.setEstado(input.estado() == null || input.estado().isBlank() ? pedido.getEstado() : input.estado().strip());
        return repository.save(pedido);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}