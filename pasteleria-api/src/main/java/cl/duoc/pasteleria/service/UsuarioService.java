package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.UsuarioRequest;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class UsuarioService {
    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<Usuario> list() {
        return repository.findAll();
    }

    public Usuario find(Long id) {
        return repository.findById(id).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @Transactional
    public Usuario create(UsuarioRequest input) {
        Usuario usuario = new Usuario(
            input.correo().strip().toLowerCase(),
            input.nombre().strip(),
            input.contrasena(),
            input.tipo() == null || input.tipo().isBlank() ? "cliente" : input.tipo().strip()
        );
        usuario.setFechaNacimiento(input.fechaNacimiento());
        usuario.setTelefono(input.telefono());
        usuario.setCodigoFelices50Aplicado(input.codigoFelices50Aplicado() == null ? false : input.codigoFelices50Aplicado());
        return repository.save(usuario);
    }

    @Transactional
    public Usuario update(Long id, UsuarioRequest input) {
        Usuario usuario = find(id);
        usuario.setCorreo(input.correo().strip().toLowerCase());
        usuario.setNombre(input.nombre().strip());
        usuario.setContrasena(input.contrasena());
        usuario.setTipo(input.tipo() == null || input.tipo().isBlank() ? usuario.getTipo() : input.tipo().strip());
        usuario.setFechaNacimiento(input.fechaNacimiento());
        usuario.setTelefono(input.telefono());
        usuario.setCodigoFelices50Aplicado(input.codigoFelices50Aplicado() == null ? false : input.codigoFelices50Aplicado());
        return repository.save(usuario);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}
