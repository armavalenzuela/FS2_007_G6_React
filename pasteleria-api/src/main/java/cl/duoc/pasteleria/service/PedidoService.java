package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.PedidoRequest;
import cl.duoc.pasteleria.model.Pedido;
import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.repository.PedidoRepository;
import cl.duoc.pasteleria.repository.ProductoRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class PedidoService {
    private final PedidoRepository repository;
    private final ProductoRepository productoRepository;
    private final ObjectMapper objectMapper;

    public PedidoService(PedidoRepository repository, ProductoRepository productoRepository, ObjectMapper objectMapper) {
        this.repository = repository;
        this.productoRepository = productoRepository;
        this.objectMapper = objectMapper;
    }

    public List<Pedido> list() {
        return repository.findAll();
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
    public Pedido create(PedidoRequest input) {
        Pedido pedido = new Pedido(input.numero().strip(), input.correoCliente().strip().toLowerCase(), input.total());
        pedido.setFecha(input.fecha());
        pedido.setEnvio(input.envio());
        pedido.setMetodoPago(input.metodoPago());
        pedido.setCodigoAutorizacion(input.codigoAutorizacion());
        pedido.setLineas(input.lineas());
        pedido.setSubtotal(input.subtotal());
        pedido.setDescuentoTortaDuoc(input.descuentoTortaDuoc());
        pedido.setDescuentoEdad(input.descuentoEdad());
        pedido.setDescuentoCodigo(input.descuentoCodigo());
        pedido.setEstado(input.estado() == null || input.estado().isBlank() ? "pagado" : input.estado().strip());
        Pedido saved = repository.save(pedido);

        // Descontar stock de los productos del pedido
        try {
            if (input.lineas() != null && !input.lineas().isBlank()) {
                JsonNode node = objectMapper.readTree(input.lineas());
                if (node.isArray()) {
                    for (JsonNode l : node) {
                        String codigo = l.has("codigo") ? l.get("codigo").asText() : null;
                        int cantidad = l.has("cantidad") ? l.get("cantidad").asInt() : 0;
                        if (codigo != null && cantidad > 0) {
                            Producto p = productoRepository.findAll().stream()
                                .filter(x -> codigo.equals(x.getCodigo()))
                                .findFirst().orElse(null);
                            if (p != null) {
                                int nuevo = Math.max(0, p.getStock() - cantidad);
                                p.setStock(nuevo);
                                productoRepository.save(p);
                            }
                        }
                    }
                }
            }
        } catch (Exception ignored) {
        }
        return saved;
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