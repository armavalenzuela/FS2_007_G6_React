package cl.duoc.pasteleria.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import cl.duoc.pasteleria.dto.ProductoRequest;
import cl.duoc.pasteleria.model.Producto;
import cl.duoc.pasteleria.repository.ProductoRepository;
import java.math.BigDecimal;
import java.util.Optional;
import org.junit.jupiter.api.Test;

class ProductoServiceTest {
    @Test
    void updateUsesTheExistingProduct() {
        ProductoRepository repo = mock(ProductoRepository.class);
        Producto existing = new Producto("TC001", "Torta Anterior", "Tortas Cuadradas", new BigDecimal("45000"), 12);
        when(repo.findById(7L)).thenReturn(Optional.of(existing));
        when(repo.save(existing)).thenReturn(existing);

        Producto updated = new ProductoService(repo)
            .update(7L, new ProductoRequest("TC001", "  Torta Nueva  ", "Tortas Cuadradas", new BigDecimal("46000"), 10, "Desc", false, 0, null));

        assertThat(updated).isSameAs(existing);
        assertThat(updated.getNombre()).isEqualTo("Torta Nueva");
    }
}
