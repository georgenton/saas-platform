export class ProductNotFoundError extends Error {
  constructor(productKey: string) {
    super(`Product with key "${productKey}" was not found.`);
  }
}
