package cl.duoc.pasteleria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;

@Entity
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String categoria;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal precio;

    @Column(nullable = false)
    private Integer stock;

    private String descripcion;
    private Boolean enOferta = false;
    private Integer descuentoOferta = 0;
    private String imagen;

    protected Producto() {}

    public Producto(String codigo, String nombre, String categoria, BigDecimal precio, Integer stock) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
    }

    public Long getId() { return id; }
    public String getCodigo() { return codigo; }
    public String getNombre() { return nombre; }
    public String getCategoria() { return categoria; }
    public BigDecimal getPrecio() { return precio; }
    public Integer getStock() { return stock; }
    public String getDescripcion() { return descripcion; }
    public Boolean getEnOferta() { return enOferta; }
    public Integer getDescuentoOferta() { return descuentoOferta; }
    public String getImagen() { return imagen; }

    public void setCodigo(String codigo) { this.codigo = codigo; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public void setEnOferta(Boolean enOferta) { this.enOferta = enOferta; }
    public void setDescuentoOferta(Integer descuentoOferta) { this.descuentoOferta = descuentoOferta; }
    public void setImagen(String imagen) { this.imagen = imagen; }
}
