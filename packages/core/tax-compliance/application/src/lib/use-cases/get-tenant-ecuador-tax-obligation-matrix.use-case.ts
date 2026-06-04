import {
  EcuadorTaxObligationMatrixView,
  EcuadorTaxObligationView,
} from '@saas-platform/tax-compliance-domain';
import { GetTenantEcuadorTaxpayerProfileUseCase } from './get-tenant-ecuador-taxpayer-profile.use-case';

export class GetTenantEcuadorTaxObligationMatrixUseCase {
  constructor(
    private readonly getTenantEcuadorTaxpayerProfileUseCase: GetTenantEcuadorTaxpayerProfileUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(tenantSlug: string): Promise<EcuadorTaxObligationMatrixView> {
    const taxpayerProfile =
      await this.getTenantEcuadorTaxpayerProfileUseCase.execute(tenantSlug);

    const rimpeSemiannual =
      taxpayerProfile.regime === 'rimpe_entrepreneur' ||
      taxpayerProfile.regime === 'rimpe_popular_business';

    const obligations: EcuadorTaxObligationView[] = [
      {
        key: 'vat',
        label: 'IVA',
        applies: true,
        frequency: rimpeSemiannual ? 'semiannual' : 'monthly',
        source: 'sri_rule_of_thumb',
        readinessStatus: taxpayerProfile.readinessStatus,
        dependsOn: [
          'invoicing_sales',
          'purchase_evidence',
          'tax_rates',
          'party_fiscal_profiles',
        ],
        notes: rimpeSemiannual
          ? ['RIMPE puede requerir periodicidad semestral segun el caso.']
          : ['Periodicidad mensual como punto de partida operativo.'],
      },
      {
        key: 'income_tax',
        label: 'Impuesto a la Renta',
        applies: true,
        frequency: 'annual',
        source: 'sri_rule_of_thumb',
        readinessStatus: taxpayerProfile.readinessStatus,
        dependsOn: ['annual_income', 'deductible_expenses', 'withholdings'],
        notes: [
          'La fecha de vencimiento depende del tipo de contribuyente y del noveno digito del RUC cuando aplique.',
        ],
      },
      {
        key: 'withholding',
        label: 'Retenciones',
        applies: taxpayerProfile.accountingObligated !== false,
        frequency:
          taxpayerProfile.accountingObligated === false ? 'unknown' : 'monthly',
        source: 'sri_rule_of_thumb',
        readinessStatus:
          taxpayerProfile.accountingObligated === false
            ? 'needs_review'
            : taxpayerProfile.readinessStatus,
        dependsOn: [
          'withholding_certificates',
          'supplier_fiscal_profiles',
          'party_fiscal_profiles',
        ],
        notes: [
          'La obligacion de retener debe confirmarse por regimen, actividad y condicion del contribuyente.',
        ],
      },
      {
        key: 'annexes',
        label: 'Anexos tributarios',
        applies: taxpayerProfile.accountingObligated !== false,
        frequency: 'unknown',
        source: 'sri_rule_of_thumb',
        readinessStatus: 'needs_review',
        dependsOn: ['taxpayer_condition', 'accountant_review'],
        notes: [
          'Los anexos aplicables deben activarse con reglas mas especificas por tipo de contribuyente.',
        ],
      },
    ];

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      taxpayerProfile,
      obligations,
      guardrails: [
        'Esta matriz es una base operativa; no sustituye la validacion final del SRI ni criterio contable.',
        'Las fechas exactas deben resolverse con calendario tributario vigente, tipo de contribuyente y noveno digito del RUC.',
        'RIMPE, contribuyente especial y obligado a llevar contabilidad pueden cambiar periodicidad, vencimientos y necesidad de revision humana.',
      ],
    };
  }
}
