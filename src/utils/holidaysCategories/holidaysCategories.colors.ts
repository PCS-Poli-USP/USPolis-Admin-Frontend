/**
 * Paleta usada para diferenciar visualmente as categorias de feriados nos
 * calendários, chips e legendas. As cores seguem os tokens do tema (uspolis.*)
 * acrescidas de tons auxiliares para categorias adicionais.
 */
export const HOLIDAY_CATEGORY_PALETTE = [
  '#408080', // uspolis.blue
  '#dcb709', // uspolis.yellow
  '#E53E3E', // uspolis.red
  '#1a535c', // uspolis.darkBlue
  '#7b5cf0',
  '#e0722a',
];

/**
 * Cor da categoria a partir da sua posição na lista exibida. Usar o índice
 * (e não o id) mantém as cores estáveis dentro de um mesmo ano e evita buracos
 * na paleta quando uma categoria é removida.
 */
export function getHolidayCategoryColor(index: number): string {
  const safeIndex = index < 0 ? 0 : index;
  return HOLIDAY_CATEGORY_PALETTE[safeIndex % HOLIDAY_CATEGORY_PALETTE.length];
}

/**
 * Mapa id -> cor para uma lista já ordenada de categorias.
 */
export function buildHolidayCategoryColorMap(
  categories: { id: number }[],
): Map<number, string> {
  const map = new Map<number, string>();
  categories.forEach((category, index) => {
    map.set(category.id, getHolidayCategoryColor(index));
  });
  return map;
}

/**
 * Aplica opacidade a uma cor hexadecimal de 6 dígitos (ex: '#40808018').
 */
export function withAlpha(color: string, alphaHex: string): string {
  return `${color}${alphaHex}`;
}
