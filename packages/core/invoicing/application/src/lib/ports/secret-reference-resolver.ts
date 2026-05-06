export interface SecretReferenceResolver {
  resolve(secretRef: string): Promise<string>;
}
