package cl.duoc.pasteleria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String correo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String contrasena;

    @Column(nullable = false)
    private String tipo = "cliente";

    private String fechaNacimiento;
    private String telefono;
    private Boolean codigoFelices50Aplicado = false;

    protected Usuario() {}

    public Usuario(String correo, String nombre, String contrasena, String tipo) {
        this.correo = correo;
        this.nombre = nombre;
        this.contrasena = contrasena;
        this.tipo = tipo;
    }

    public Long getId() { return id; }
    public String getCorreo() { return correo; }
    public String getNombre() { return nombre; }
    public String getContrasena() { return contrasena; }
    public String getTipo() { return tipo; }
    public String getFechaNacimiento() { return fechaNacimiento; }
    public String getTelefono() { return telefono; }
    public Boolean getCodigoFelices50Aplicado() { return codigoFelices50Aplicado; }

    public void setCorreo(String correo) { this.correo = correo; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public void setFechaNacimiento(String fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setCodigoFelices50Aplicado(Boolean codigoFelices50Aplicado) { this.codigoFelices50Aplicado = codigoFelices50Aplicado; }
}
