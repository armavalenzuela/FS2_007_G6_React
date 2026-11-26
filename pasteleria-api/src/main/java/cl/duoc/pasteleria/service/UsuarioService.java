package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.UsuarioRequest;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import java.util.List;
import java.util.Locale;
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

    public Usuario findByCorreo(String correo) {
        return repository.findByCorreoIgnoreCase(correo).orElseThrow(() ->
            new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @Transactional
    public Usuario actualizarPerfil(String correo, String fechaNacimiento, String telefono, String codigoPromocional) {
        Usuario usuario = findByCorreo(correo);
        if (fechaNacimiento != null) usuario.setFechaNacimiento(fechaNacimiento);
        if (telefono != null) usuario.setTelefono(telefono);
        aplicarCodigo(usuario, codigoPromocional);
        return repository.save(usuario);
    }

    @Transactional
    public Usuario create(UsuarioRequest input) {
        String correo = input.correo().strip().toLowerCase(Locale.ROOT);
        if (repository.findByCorreoIgnoreCase(correo).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya hay una cuenta con ese correo.");
        }
        Usuario usuario = new Usuario(
            correo,
            input.nombre().strip(),
            input.contrasena(),
            input.tipo() == null || input.tipo().isBlank() ? "cliente" : input.tipo().strip()
        );
        usuario.setFechaNacimiento(input.fechaNacimiento());
        usuario.setTelefono(input.telefono());
        aplicarCodigo(usuario, input.codigoPromocional());
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
        aplicarCodigo(usuario, input.codigoPromocional());
        return repository.save(usuario);
    }

    private void aplicarCodigo(Usuario usuario, String codigoPromocional) {
        if (codigoPromocional == null || codigoPromocional.isBlank()) return;
        if (!"FELICES50".equalsIgnoreCase(codigoPromocional.strip())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El código ingresado no es válido.");
        }
        usuario.setCodigoFelices50Aplicado(true);
    }

    @Transactional
    public void delete(Long id) {
        repository.delete(find(id));
    }
}
