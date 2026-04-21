export class RoleNotFoundError extends Error {
  constructor(roleKey: string) {
    super(`Role "${roleKey}" was not found.`);
    this.name = 'RoleNotFoundError';
  }
}
