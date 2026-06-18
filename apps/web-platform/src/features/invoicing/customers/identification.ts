export type BuyerIdentificationType = '04' | '05' | '06' | '07' | '08';

export type BuyerIdentificationOption = {
  hint: string;
  label: string;
  placeholder: string;
  shortLabel: string;
};

export const BUYER_IDENTIFICATION_TYPES: Record<
  BuyerIdentificationType,
  BuyerIdentificationOption
> = {
  '04': {
    label: 'RUC',
    shortLabel: 'RUC',
    hint: 'Empresa o negocio con RUC',
    placeholder: '1790012345001',
  },
  '05': {
    label: 'Cedula',
    shortLabel: 'Cedula',
    hint: 'Persona natural ecuatoriana',
    placeholder: '0102030405',
  },
  '06': {
    label: 'Pasaporte',
    shortLabel: 'Pasaporte',
    hint: 'Extranjero con pasaporte',
    placeholder: 'AB1234567',
  },
  '07': {
    label: 'Consumidor final',
    shortLabel: 'Consumidor final',
    hint: 'Venta sin identificar al comprador',
    placeholder: '9999999999999',
  },
  '08': {
    label: 'Exterior',
    shortLabel: 'Exterior',
    hint: 'Cliente fuera de Ecuador',
    placeholder: 'EXT-000123',
  },
};

export function getBuyerIdentificationType(
  value: string | null | undefined,
): BuyerIdentificationOption | null {
  if (value && value in BUYER_IDENTIFICATION_TYPES) {
    return BUYER_IDENTIFICATION_TYPES[value as BuyerIdentificationType];
  }

  return null;
}
