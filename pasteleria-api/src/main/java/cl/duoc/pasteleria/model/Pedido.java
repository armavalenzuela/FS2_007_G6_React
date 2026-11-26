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

    private String fecha;

    @Column(columnDefinition = "TEXT")
    private String envio;

    private String metodoPago;
    private String codigoAutorizacion;

    @Column(columnDefinition = "TEXT")
    private String lineas;

    @Column(precision = 12, scale = 2)
    private BigDecimal subtotal;

    @Column(precision = 12, scale = 2)
    private BigDecimal descuentoTortaDuoc;

    @Column(precision = 12, scale = 2)
    private BigDecimal descuentoOferta;

    @Column(precision = 12, scale = 2)
    private BigDecimal descuentoEdad;

    @Column(precision = 12, scale = 2)
    private BigDecimal descuentoCodigo;

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
    public String getFecha() { return fecha; }
    public String getEnvio() { return envio; }
    public String getMetodoPago() { return metodoPago; }
    public String getCodigoAutorizacion() { return codigoAutorizacion; }
    public String getLineas() { return lineas; }
    public BigDecimal getSubtotal() { return subtotal; }
    public BigDecimal getDescuentoTortaDuoc() { return descuentoTortaDuoc; }
    public BigDecimal getDescuentoOferta() { return descuentoOferta; }
    public BigDecimal getDescuentoEdad() { return descuentoEdad; }
    public BigDecimal getDescuentoCodigo() { return descuentoCodigo; }
    public BigDecimal getTotal() { return total; }
    public String getEstado() { return estado; }

    public void setNumero(String numero) { this.numero = numero; }
    public void setCorreoCliente(String correoCliente) { this.correoCliente = correoCliente; }
    public void setFecha(String fecha) { this.fecha = fecha; }
    public void setEnvio(String envio) { this.envio = envio; }
    public void setMetodoPago(String metodoPago) { this.metodoPago = metodoPago; }
    public void setCodigoAutorizacion(String codigoAutorizacion) { this.codigoAutorizacion = codigoAutorizacion; }
    public void setLineas(String lineas) { this.lineas = lineas; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }
    public void setDescuentoTortaDuoc(BigDecimal descuentoTortaDuoc) { this.descuentoTortaDuoc = descuentoTortaDuoc; }
    public void setDescuentoOferta(BigDecimal descuentoOferta) { this.descuentoOferta = descuentoOferta; }
    public void setDescuentoEdad(BigDecimal descuentoEdad) { this.descuentoEdad = descuentoEdad; }
    public void setDescuentoCodigo(BigDecimal descuentoCodigo) { this.descuentoCodigo = descuentoCodigo; }
    public void setTotal(BigDecimal total) { this.total = total; }
    public void setEstado(String estado) { this.estado = estado; }
}