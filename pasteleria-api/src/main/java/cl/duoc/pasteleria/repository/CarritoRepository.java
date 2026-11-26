package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Carrito;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarritoRepository extends JpaRepository<Carrito, Long> {
    Carrito findByCorreoUsuario(String correoUsuario);
}
