package cl.duoc.pasteleria.dto;

public record AuthResponse(String token, String tipo, String correo, String rol) {}
