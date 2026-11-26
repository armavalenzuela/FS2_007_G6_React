package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Pedido;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByNumero(String numero);
    List<Pedido> findByCorreoClienteIgnoreCaseOrderByFechaDesc(String correo);
}