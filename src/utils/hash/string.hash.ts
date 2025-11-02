function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32-bit int
  }
  return hash >>> 0; // Ensure positive
}

function stringToRgb(str: string): [number, number, number] {
  const hash = simpleHash(str);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return [r, g, b];
}

function stringToHexColor(str: string): string {
  const [r, g, b] = stringToRgb(str);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export { stringToRgb, stringToHexColor };
