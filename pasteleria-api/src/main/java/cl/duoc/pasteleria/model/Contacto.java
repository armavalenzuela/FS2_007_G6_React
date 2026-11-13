package cl.duoc.pasteleria.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Contacto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nombre;
    private String correo;
    private String comentario;
    private String fechaEntrega;

    protected Contacto() {}

    public Contacto(String nombre, String correo, String comentario, String fechaEntrega) {
        this.nombre = nombre;
        this.correo = correo;
        this.comentario = comentario;
        this.fechaEntrega = fechaEntrega;
    }

    public Long getId() { return id; }
    public String getNombre() { return nombre; }
    public String getCorreo() { return correo; }
    public String getComentario() { return comentario; }
    public String getFechaEntrega() { return fechaEntrega; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCorreo(String correo) { this.correo = correo; }
    public void setComentario(String comentario) { this.comentario = comentario; }
    public void setFechaEntrega(String fechaEntrega) { this.fechaEntrega = fechaEntrega; }
}
