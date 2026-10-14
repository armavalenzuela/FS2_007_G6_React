import { createRoot } from "react-dom/client";
import { act } from "react";

export function montar(elemento) {
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const contenedor = document.createElement("div");
  document.body.appendChild(contenedor);
  const raiz = createRoot(contenedor);
  act(() => {
    raiz.render(elemento);
  });
  return {
    contenedor,
    limpiar() {
      act(() => raiz.unmount());
      contenedor.remove();
    },
  };
}

export function escribir(input, valor) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
  const setterArea = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
  const esTextarea = input.tagName === "TEXTAREA";
  act(() => {
    (esTextarea ? setterArea : setter).call(input, valor);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

export function clic(elemento) {
  act(() => {
    elemento.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
}

export function buscarBoton(contenedor, texto) {
  return Array.from(contenedor.querySelectorAll("button")).find((b) => b.textContent.includes(texto));
}

export function disparar(elemento, nombreEvento) {
  act(() => {
    elemento.dispatchEvent(new Event(nombreEvento));
  });
}
