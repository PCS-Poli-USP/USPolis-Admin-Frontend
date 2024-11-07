export function nameInvalid(name: string) {
  return name.length <= 0;
}

export function emailInvalid(email: string) {
  return email.length <= 0 || !email.includes('@') || !email.includes('.');
}

export function buildingsInvalid(buildings: number[], is_admin: boolean) {
  return buildings.length <= 0 && !is_admin;
}
