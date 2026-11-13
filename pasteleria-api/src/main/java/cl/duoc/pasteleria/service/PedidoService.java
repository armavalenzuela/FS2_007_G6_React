package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.PedidoRequest;
import cl.duoc.pasteleria.model.Pedido;
import cl.duoc.pasteleria.repository.PedidoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class PedidoService {
    private final PedidoRepository repository;

    public PedidoService(PedidoRepository repository) {
        this.repository = repository;
    }

    public List<Pedido> list() {
        return repository.findAll();
    }

    public Pedido find(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Pedido no encontrado"));
    }

    @Transactional
    public Pedido create(PedidoRequest input) {
        Pedido pedido = new Pedido(input.numero().strip(), input.correoCliente().strip().toLowerCase(), input.total());
        pedido.setEstado(input.estado() == null || input.estado().isBlank() ? "pendiente" : input.estado().strip());
        return repository.save(pedido);
    }

    @Transactional
    public Pedido update(Long id, PedidoRequest input) {
        Pedido pedido = find(id);
        pedido.setNumero(input.numero().strip());
        pedido.setCorreoCliente(input.correoCliente().strip().toLowerCase());
        pedido.setTotal(input.total());
        pedido.setEstado(input.estado() == null || input.estado().isBlank() ? pedido.getEstado() : input.estado().strip());
        return repository.save(pedido);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}
