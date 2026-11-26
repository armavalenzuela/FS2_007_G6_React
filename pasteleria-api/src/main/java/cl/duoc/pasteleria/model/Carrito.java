package cl.duoc.pasteleria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Carrito {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String correoUsuario;

    @Column(columnDefinition = "TEXT")
    private String items = "[]";

    private String fechaActualizacion;

    protected Carrito() {}

    public Carrito(String correoUsuario) {
        this.correoUsuario = correoUsuario;
        this.items = "[]";
        this.fechaActualizacion = java.time.Instant.now().toString();
    }

    public Long getId() { return id; }
    public String getCorreoUsuario() { return correoUsuario; }
    public String getItems() { return items; }
    public String getFechaActualizacion() { return fechaActualizacion; }

    public void setCorreoUsuario(String correoUsuario) { this.correoUsuario = correoUsuario; }
    public void setItems(String items) { this.items = items; }
    public void setFechaActualizacion(String fechaActualizacion) { this.fechaActualizacion = fechaActualizacion; }
}
