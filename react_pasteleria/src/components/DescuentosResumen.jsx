import { formatoPesos } from "../utils/formato.js";

const DESCUENTOS = [
  ["descuentoOferta", "Descuento por ofertas"],
  ["descuentoTortaDuoc", "Torta de cumpleaños Duoc"],
  ["descuentoEdad", "Descuento 50% por edad"],
  ["descuentoCodigo", "Código FELICES50 (10%)"],
];

export default function DescuentosResumen({ resumen }) {
  return DESCUENTOS.map(([campo, etiqueta]) => resumen[campo] > 0 && (
    <div key={campo} className="d-flex justify-content-between mb-2 texto-secundario">
      <span>{etiqueta}</span><span>-{formatoPesos(resumen[campo])}</span>
    </div>
  ));
}
