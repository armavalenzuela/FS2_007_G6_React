package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.AuthResponse;
import cl.duoc.pasteleria.dto.LoginRequest;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import cl.duoc.pasteleria.security.JwtService;
import io.jsonwebtoken.Claims;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UsuarioRepository repository;
    private final JwtService jwtService;

    public AuthService(UsuarioRepository repository, JwtService jwtService) {
        this.repository = repository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest input) {
        Usuario usuario = repository.findByCorreoIgnoreCase(input.correo().strip())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invǭlidas"));
        if (!usuario.getContrasena().equals(input.contrasena())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invǭlidas");
        }
        return emitirToken(usuario);
    }

    private AuthResponse emitirToken(Usuario usuario) {
        String rol = usuario.getTipo().strip().toUpperCase(Locale.ROOT);
        if ("ADMINISTRADOR".equals(rol)) rol = "ADMIN";
        String token = jwtService.generate(usuario.getCorreo(), rol);
        return new AuthResponse(token, "Bearer", usuario.getCorreo(), rol);
    }

    public AuthResponse refresh(String token) {
        try {
            Claims claims = jwtService.parse(token);
            Usuario usuario = repository.findByCorreoIgnoreCase(claims.getSubject()).orElseThrow();
            return emitirToken(usuario);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invǭlido o expirado");
        }
    }
}
