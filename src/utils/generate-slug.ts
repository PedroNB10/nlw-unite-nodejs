export function generateSlug(text: string): string {
  return text
    .normalize("NFD") // normalize para remover acentos
    .replace(/[\u0300-\u036f]/g, "") // remove caracteres especiais
    .toLowerCase() // deixa tudo em minúsculo
    .replace(/[^\w\s-]/g, "") // remove caracteres especiais
    .replace(/\s+/g, "-"); // substitui espaços por hífens
}
