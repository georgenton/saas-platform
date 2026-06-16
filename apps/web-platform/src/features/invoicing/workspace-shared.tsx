import styles from '../../app/app.module.css';
import type { InvoiceDetailResponse } from '../../app/types';
import type { InvoicingReadinessTone, InvoicingWorkspaceStage } from './model';

const stepLabels = ['Borrador', 'Generado', 'Enviado', 'Autorizado'] as const;

export function Stepper({ stage }: { stage: InvoicingWorkspaceStage }) {
  const currentStepIndex = currentStepPosition(stage);

  return (
    <div className={styles.invoicingStepper} aria-label="Estado del documento">
      {stepLabels.map((label, index) => {
        const tone = stepTone(stage, index, currentStepIndex);

        return (
          <div className={styles.invoicingStepperStep} key={label}>
            <span
              className={`${styles.invoicingStepperNode} ${
                styles[`invoicingStepperNode${capitalizeTone(tone)}`]
              }`}
            >
              {stepGlyph(stage, index, currentStepIndex)}
            </span>
            <small>{label}</small>
          </div>
        );
      })}
    </div>
  );
}

export function deriveStageFromInvoiceDetail(
  invoice: InvoiceDetailResponse,
): InvoicingWorkspaceStage {
  const electronicStatus = invoice.electronicStatus?.toLowerCase() ?? '';

  if (electronicStatus.includes('authorized')) {
    return 'authorized';
  }

  if (
    electronicStatus.includes('rejected') ||
    electronicStatus.includes('returned')
  ) {
    return 'rejected';
  }

  if (electronicStatus.includes('submitted') || invoice.submittedAt) {
    return 'submitted';
  }

  if (electronicStatus.includes('generated') || invoice.signedAt) {
    return 'generated';
  }

  return 'none';
}

function currentStepPosition(stage: InvoicingWorkspaceStage): number {
  switch (stage) {
    case 'generated':
      return 1;
    case 'submitted':
    case 'rejected':
      return 2;
    case 'authorized':
      return 3;
    default:
      return 0;
  }
}

function stepTone(
  stage: InvoicingWorkspaceStage,
  index: number,
  currentStepIndex: number,
): InvoicingReadinessTone {
  if (stage === 'rejected' && index === 2) {
    return 'danger';
  }

  if (index < currentStepIndex) {
    return 'success';
  }

  if (index === currentStepIndex) {
    return stage === 'authorized' ? 'success' : 'warning';
  }

  return 'neutral';
}

function stepGlyph(
  stage: InvoicingWorkspaceStage,
  index: number,
  currentStepIndex: number,
): string {
  if (stage === 'rejected' && index === 2) {
    return 'x';
  }

  if (index < currentStepIndex || stage === 'authorized') {
    return '✓';
  }

  if (index === currentStepIndex) {
    return '•';
  }

  return '○';
}

function capitalizeTone(tone: InvoicingReadinessTone): string {
  return `${tone.charAt(0).toUpperCase()}${tone.slice(1)}`;
}
