package cl.duoc.pasteleria.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.math.BigDecimal;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String numero;

    @Column(nullable = false)
    private String correoCliente;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal total;

    @Column(nullable = false)
    private String estado = "pendiente";

    protected Pedido() {}

    public Pedido(String numero, String correoCliente, BigDecimal total) {
        this.numero = numero;
        this.correoCliente = correoCliente;
        this.total = total;
    }

    public Long getId() { return id; }
    public String getNumero() { return numero; }
    public String getCorreoCliente() { return correoCliente; }
    public BigDecimal getTotal() { return total; }
    public String getEstado() { return estado; }

    public void setNumero(String numero) { this.numero = numero; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public void setEstado(String estado) { this.estado = estado; }
}
