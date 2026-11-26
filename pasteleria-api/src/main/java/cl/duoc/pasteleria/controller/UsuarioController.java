package cl.duoc.pasteleria.controller;

import cl.duoc.pasteleria.dto.UsuarioRequest;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<Usuario> list() { return service.list(); }

    public record PerfilRequest(String fechaNacimiento, String telefono, String codigoPromocional) {}

    public record Perfil(Long id, String nombre, String correo, String fechaNacimiento, String telefono,
                         Boolean codigoFelices50Aplicado) {
        static Perfil de(Usuario usuario) {
            return new Perfil(usuario.getId(), usuario.getNombre(), usuario.getCorreo(),
                usuario.getFechaNacimiento(), usuario.getTelefono(), usuario.getCodigoFelices50Aplicado());
        }
    }

    @GetMapping("/me")
    public Perfil perfil(Authentication auth) {
        return Perfil.de(service.findByCorreo(auth.getName()));
    }

    @PutMapping("/me")
    public Perfil actualizarPerfil(Authentication auth, @RequestBody PerfilRequest input) {
        return Perfil.de(service.actualizarPerfil(auth.getName(), input.fechaNacimiento(), input.telefono(),
            input.codigoPromocional()));
    }

    @GetMapping("/{id}")
    public Usuario find(@PathVariable("id") Long id) { return service.find(id); }

    @Operation(summary = "Crear un usuario")
    @PostMapping
    public ResponseEntity<Usuario> create(@Valid @RequestBody UsuarioRequest input) {
        Usuario saved = service.create(input);
        return ResponseEntity.created(URI.create("/api/usuarios/" + saved.getId())).body(saved);
    }

    @PutMapping("/{id}")
    public Usuario update(@PathVariable("id") Long id, @Valid @RequestBody UsuarioRequest input) {
        return service.update(id, input);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
