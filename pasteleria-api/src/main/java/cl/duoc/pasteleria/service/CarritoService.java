package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.model.Carrito;
import cl.duoc.pasteleria.repository.CarritoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class CarritoService {
    private final CarritoRepository repository;

    public CarritoService(CarritoRepository repository) {
        this.repository = repository;
    }

    public String getItems(String correoUsuario) {
        Carrito carrito = repository.findByCorreoUsuario(correoUsuario);
        return carrito == null ? "[]" : (carrito.getItems() == null ? "[]" : carrito.getItems());
    }

    @Transactional
    public String save(String correoUsuario, String items) {
        Carrito carrito = repository.findByCorreoUsuario(correoUsuario);
        if (carrito == null) {
            carrito = new Carrito(correoUsuario);
        }
        carrito.setItems(items == null || items.isBlank() ? "[]" : items);
        carrito.setFechaActualizacion(java.time.Instant.now().toString());
        repository.save(carrito);
        return carrito.getItems();
    }

    @Transactional
    public void clear(String correoUsuario) {
        Carrito carrito = repository.findByCorreoUsuario(correoUsuario);
        if (carrito != null) {
            carrito.setItems("[]");
            carrito.setFechaActualizacion(java.time.Instant.now().toString());
            repository.save(carrito);
        }
    }
}
