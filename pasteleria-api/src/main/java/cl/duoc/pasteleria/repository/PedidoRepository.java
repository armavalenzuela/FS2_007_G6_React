package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {}
