package cl.duoc.pasteleria.repository;

import cl.duoc.pasteleria.model.Producto;
import jakarta.persistence.LockModeType;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCodigoIn(Collection<String> codigos);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    List<Producto> findByCodigoInOrderByCodigoAsc(Collection<String> codigos);
}
