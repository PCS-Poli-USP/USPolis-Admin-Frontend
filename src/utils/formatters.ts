export function Capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function Textify(value: any) {
  if (typeof value === 'boolean') {
    return value ? 'Sim' : 'Não';
  }

  return value?.toString();
}
