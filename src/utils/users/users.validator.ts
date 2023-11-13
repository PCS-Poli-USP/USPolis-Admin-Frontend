export function nameInvalid(name: string) {
  return name.length <= 0;
}

export function emailInvalid(email: string) {
  return email.length <= 0 && !email.includes('@') && !email.includes('.');
}

export function usernameInvalid(username: string) {
  return username.length <= 0 || username.includes(' ');
}

export function buildingsInvalid(buildings: string[], isAdmin: boolean) {
  return buildings.length <= 0 && !isAdmin;
}
