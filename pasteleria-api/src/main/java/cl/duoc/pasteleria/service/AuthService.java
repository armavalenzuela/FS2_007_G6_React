package cl.duoc.pasteleria.service;

import cl.duoc.pasteleria.dto.AuthResponse;
import cl.duoc.pasteleria.dto.LoginRequest;
import cl.duoc.pasteleria.model.Usuario;
import cl.duoc.pasteleria.repository.UsuarioRepository;
import cl.duoc.pasteleria.security.JwtService;
import io.jsonwebtoken.Claims;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
        Usuario usuario = repository.findAll().stream()
            .filter(u -> u.getCorreo().equalsIgnoreCase(input.correo().trim()))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invǭlidas"));
        if (!usuario.getContrasena().equals(input.contrasena())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales invǭlidas");
        }
        String token = jwtService.generate(usuario.getCorreo(), usuario.getTipo().toUpperCase());
        return new AuthResponse(token, "Bearer", usuario.getCorreo(), usuario.getTipo());
    }

    public AuthResponse refresh(String token) {
        try {
            Claims claims = jwtService.parse(token);
            String correo = claims.getSubject();
            String rol = String.valueOf(claims.get("role"));
            String nuevoToken = jwtService.generate(correo, rol);
            return new AuthResponse(nuevoToken, "Bearer", correo, rol);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token invǭlido o expirado");
        }
    }
}
