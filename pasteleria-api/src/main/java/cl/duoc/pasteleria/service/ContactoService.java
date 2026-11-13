package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.ContactoRequest;
import cl.duoc.pasteleria.model.Contacto;
import cl.duoc.pasteleria.repository.ContactoRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ContactoService {
    private final ContactoRepository repository;

    public ContactoService(ContactoRepository repository) {
        this.repository = repository;
    }

    public List<Contacto> list() {
        return repository.findAll();
    }

    public Contacto find(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Contacto no encontrado"));
    }

    @Transactional
    public Contacto create(ContactoRequest input) {
        Contacto contacto = new Contacto(
            input.nombre().strip(),
            input.correo().strip().toLowerCase(),
            input.comentario().strip(),
            input.fechaEntrega()
        );
        return repository.save(contacto);
    }

    @Transactional
    public Contacto update(Long id, ContactoRequest input) {
        Contacto contacto = find(id);
        contacto.setNombre(input.nombre().strip());
        contacto.setCorreo(input.correo().strip().toLowerCase());
        contacto.setComentario(input.comentario().strip());
        contacto.setFechaEntrega(input.fechaEntrega());
        return repository.save(contacto);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}
