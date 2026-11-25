// src/utils/contenido.js
import DOMPurify from "dompurify";

const TIENE_HTML = /<\/?[a-z][\s\S]*>/i;

// Para el detalle: HTML limpio con formato
export function htmlSeguro(texto = "") {
  return DOMPurify.sanitize(String(texto).replace(/&nbsp;|\u00a0/g, " "));
}

// Para tarjetas y buscador: texto plano recortado
export function resumenPlano(contenido = "", maxLargo = 160) {
  let texto = String(contenido);

  if (TIENE_HTML.test(texto)) {
    const doc = new DOMParser().parseFromString(htmlSeguro(texto), "text/html");
    texto = doc.body.textContent || "";
  }

  texto = texto.replace(/\s+/g, " ").trim();
  return texto.length > maxLargo ? texto.slice(0, maxLargo).trimEnd() + "…" : texto;
}