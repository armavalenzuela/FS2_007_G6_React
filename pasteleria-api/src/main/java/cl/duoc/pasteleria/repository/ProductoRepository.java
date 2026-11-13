package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductoRepository extends JpaRepository<Producto, Long> {}
