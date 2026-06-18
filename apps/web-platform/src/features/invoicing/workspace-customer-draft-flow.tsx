import {
  type FormEventHandler,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from '../../app/app.module.css';
import type { CustomerResponse } from '../../app/types';
import {
  BUYER_IDENTIFICATION_TYPES,
  getBuyerIdentificationType,
  type BuyerIdentificationType,
} from './customers/identification';

type CustomerDraftFlowStep = 'buyer' | 'identity' | 'draft';

type InvoicingCustomerDraftFlowProps = {
  actionLoading: string | null;
  customers: CustomerResponse[];
  formatBuyerIdentificationType: (value: string | null) => string;
  invoicingLoading: boolean;
  nextInvoiceNumberSuggestion: string;
  customerForm: {
    billingAddress: string;
    email: string;
    identificationType: BuyerIdentificationType;
    name: string;
    taxId: string;
    onBillingAddressChange: (value: string) => void;
    onEmailChange: (value: string) => void;
    onIdentificationTypeChange: (value: BuyerIdentificationType) => void;
    onNameChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
    onTaxIdChange: (value: string) => void;
  };
  invoiceForm: {
    currency: string;
    customerId: string;
    dueAt: string;
    notes: string;
    number: string;
    status: string;
    onCurrencyChange: (value: string) => void;
    onCustomerIdChange: (value: string) => void;
    onDueAtChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onNumberChange: (value: string) => void;
    onStatusChange: (value: string) => void;
    onSubmit: FormEventHandler<HTMLFormElement>;
  };
};

const FLOW_STEPS: Array<{
  key: CustomerDraftFlowStep;
  label: string;
  eyebrow: string;
}> = [
  { key: 'buyer', label: 'Comprador', eyebrow: 'Paso 1' },
  { key: 'identity', label: 'Identidad fiscal', eyebrow: 'Paso 2' },
  { key: 'draft', label: 'Borrador', eyebrow: 'Paso 3' },
];

function getBuyerIdentificationLabel(customer: CustomerResponse) {
  const type = getBuyerIdentificationType(customer.identificationType);
  const identification =
    customer.identification ?? customer.taxId ?? 'Sin identificacion';

  return `${type?.shortLabel ?? 'ID'} · ${identification}`;
}

function getCustomerInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

function deriveFlowState(
  selectedCustomerId: string,
  currentStep: CustomerDraftFlowStep,
  draftIsReady: boolean,
) {
  const done = new Set<CustomerDraftFlowStep>();
  const reachable = new Set<CustomerDraftFlowStep>(['buyer']);

  if (selectedCustomerId) {
    done.add('buyer');
    reachable.add('identity');
    reachable.add('draft');
  }

  if (currentStep === 'draft' && selectedCustomerId) {
    done.add('identity');
  }

  if (draftIsReady) {
    done.add('buyer');
    done.add('identity');
  }

  return { done, reachable };
}

function StepCard({
  children,
  eyebrow,
  title,
  trailing,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
  trailing?: ReactNode;
}) {
  return (
    <section className={styles.invoicingCustomerStepCard}>
      <header className={styles.invoicingCustomerStepHeader}>
        <div>
          <span className={styles.label}>{eyebrow}</span>
          <h3>{title}</h3>
        </div>
        {trailing}
      </header>
      <div className={styles.invoicingCustomerStepBody}>{children}</div>
    </section>
  );
}

function FieldFact({
  label,
  value,
  mono,
}: {
  label: string;
  value: string | null | undefined;
  mono?: boolean;
}) {
  return (
    <div className={styles.invoicingCustomerFactRow}>
      <span>{label}</span>
      <strong className={mono ? styles.monoValue : undefined}>
        {value?.trim() ? value : 'Sin dato'}
      </strong>
    </div>
  );
}

function InvoicingCustomerStepper({
  currentStep,
  done,
  onStepChange,
  reachable,
}: {
  currentStep: CustomerDraftFlowStep;
  done: Set<CustomerDraftFlowStep>;
  onStepChange: (step: CustomerDraftFlowStep) => void;
  reachable: Set<CustomerDraftFlowStep>;
}) {
  return (
    <div
      className={styles.invoicingCustomerStepper}
      aria-label="Flujo de factura"
    >
      {FLOW_STEPS.map((step, index) => {
        const isCurrent = currentStep === step.key;
        const isDone = done.has(step.key);
        const canReach = reachable.has(step.key);

        return (
          <button
            aria-current={isCurrent ? 'step' : undefined}
            className={[
              styles.invoicingCustomerStepButton,
              isCurrent ? styles.invoicingCustomerStepButtonActive : '',
              isDone ? styles.invoicingCustomerStepButtonDone : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={!canReach}
            key={step.key}
            onClick={() => onStepChange(step.key)}
            type="button"
          >
            <span>{isDone ? 'OK' : index + 1}</span>
            <small>{step.eyebrow}</small>
            <strong>{step.label}</strong>
          </button>
        );
      })}
    </div>
  );
}

export function InvoicingCustomerDraftFlow({
  actionLoading,
  customerForm,
  customers,
  formatBuyerIdentificationType,
  invoiceForm,
  invoicingLoading,
  nextInvoiceNumberSuggestion,
}: InvoicingCustomerDraftFlowProps) {
  const [currentStep, setCurrentStep] = useState<CustomerDraftFlowStep>(() =>
    invoiceForm.customerId ? 'identity' : 'buyer',
  );
  const hasCustomers = customers.length > 0;
  const selectedCustomer = useMemo(
    () =>
      customers.find((customer) => customer.id === invoiceForm.customerId) ??
      null,
    [customers, invoiceForm.customerId],
  );
  const idType = BUYER_IDENTIFICATION_TYPES[customerForm.identificationType];
  const draftIsReady = Boolean(
    invoiceForm.customerId && invoiceForm.currency.trim(),
  );
  const flowState = deriveFlowState(
    invoiceForm.customerId,
    currentStep,
    draftIsReady,
  );

  useEffect(() => {
    if (!invoiceForm.customerId && currentStep !== 'buyer') {
      setCurrentStep('buyer');
    }
  }, [currentStep, invoiceForm.customerId]);

  const selectCustomer = (customerId: string) => {
    invoiceForm.onCustomerIdChange(customerId);
    setCurrentStep('identity');
  };

  return (
    <section
      className={styles.invoicingCustomerFlow}
      id="invoicing-customer-draft-flow"
    >
      <div className={styles.invoicingCustomerFlowHero}>
        <div>
          <span className={styles.label}>Invoicing · Primera factura</span>
          <h3>Comprador y borrador</h3>
          <p>
            Crea o elige al comprador, confirma su identidad fiscal y genera el
            borrador. Sin envio al SRI todavia.
          </p>
        </div>
        <div className={styles.invoicingCustomerHeroMeta}>
          <span className={styles.statusPill}>Lane guiada</span>
          <small>No firma · no autoriza · no declara</small>
        </div>
      </div>

      <InvoicingCustomerStepper
        currentStep={currentStep}
        done={flowState.done}
        onStepChange={setCurrentStep}
        reachable={flowState.reachable}
      />

      <div className={styles.invoicingCustomerFlowGrid}>
        <div className={styles.invoicingCustomerFlowMain}>
          {currentStep === 'buyer' ? (
            <StepCard
              eyebrow="Paso 1 de 3"
              title={
                hasCustomers
                  ? 'Elige o crea el comprador'
                  : 'Crea tu primer comprador'
              }
              trailing={
                <span className={styles.statusPill}>
                  {hasCustomers
                    ? `${customers.length} registrados`
                    : 'Primer comprador'}
                </span>
              }
            >
              {invoicingLoading ? (
                <p className={styles.muted}>Cargando compradores...</p>
              ) : hasCustomers ? (
                <div className={styles.stack}>
                  <div className={styles.invoicingCustomerDirectoryHeader}>
                    <span>Directorio fiscal</span>
                    <small>
                      Selecciona un comprador para confirmar sus datos antes del
                      borrador.
                    </small>
                  </div>
                  <div className={styles.invoicingCustomerDirectory}>
                    {customers.map((customer) => {
                      const selected = customer.id === invoiceForm.customerId;

                      return (
                        <button
                          className={[
                            styles.invoicingCustomerBuyerRow,
                            selected
                              ? styles.invoicingCustomerBuyerRowSelected
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          key={customer.id}
                          onClick={() => selectCustomer(customer.id)}
                          type="button"
                        >
                          <span className={styles.invoicingCustomerAvatar}>
                            {getCustomerInitials(customer.name)}
                          </span>
                          <span>
                            <strong>{customer.name}</strong>
                            <small>
                              {getBuyerIdentificationLabel(customer)}
                            </small>
                          </span>
                          <em>
                            {formatBuyerIdentificationType(
                              customer.identificationType,
                            )}
                          </em>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <strong>Aun no tienes compradores</strong>
                  <p>
                    Toda factura empieza por un comprador. Registra el primero
                    con sus datos fiscales de Ecuador y seguimos con el
                    borrador.
                  </p>
                </div>
              )}

              <form
                className={styles.invoicingCustomerForm}
                onSubmit={customerForm.onSubmit}
              >
                <div className={styles.invoicingCustomerFormHeader}>
                  <div>
                    <span className={styles.label}>Nuevo comprador</span>
                    <strong>Datos fiscales reutilizables</strong>
                  </div>
                  <small>{idType.hint}</small>
                </div>
                <label className={styles.field}>
                  <span>Nombre o razon social</span>
                  <input
                    onChange={(event) =>
                      customerForm.onNameChange(event.target.value)
                    }
                    placeholder="Comercial Andina S.A."
                    value={customerForm.name}
                  />
                </label>
                <div className={styles.invoiceInlineGrid}>
                  <label className={styles.field}>
                    <span>Email</span>
                    <input
                      onChange={(event) =>
                        customerForm.onEmailChange(event.target.value)
                      }
                      placeholder="pagos@andina.ec"
                      type="email"
                      value={customerForm.email}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Tipo de identificacion</span>
                    <select
                      className={styles.selectField}
                      onChange={(event) =>
                        customerForm.onIdentificationTypeChange(
                          event.target.value as BuyerIdentificationType,
                        )
                      }
                      value={customerForm.identificationType}
                    >
                      {Object.entries(BUYER_IDENTIFICATION_TYPES).map(
                        ([value, option]) => (
                          <option key={value} value={value}>
                            {value} · {option.label}
                          </option>
                        ),
                      )}
                    </select>
                  </label>
                </div>
                <div className={styles.invoiceInlineGrid}>
                  <label className={styles.field}>
                    <span>Identificacion</span>
                    <input
                      className={styles.monoValue}
                      onChange={(event) =>
                        customerForm.onTaxIdChange(event.target.value)
                      }
                      placeholder={idType.placeholder}
                      value={customerForm.taxId}
                    />
                    <small className={styles.fieldHint}>
                      {customerForm.identificationType === '07'
                        ? 'Consumidor final suele usar 9999999999999.'
                        : idType.hint}
                    </small>
                  </label>
                  <label className={styles.field}>
                    <span>Direccion</span>
                    <input
                      onChange={(event) =>
                        customerForm.onBillingAddressChange(event.target.value)
                      }
                      placeholder="Direccion del comprador"
                      value={customerForm.billingAddress}
                    />
                  </label>
                </div>
                <div className={styles.inlineActionRow}>
                  <button
                    className={styles.primaryButton}
                    disabled={
                      !customerForm.name.trim() ||
                      actionLoading === 'create-customer'
                    }
                    type="submit"
                  >
                    {actionLoading === 'create-customer'
                      ? 'Guardando comprador...'
                      : 'Guardar comprador'}
                  </button>
                  <p className={styles.muted}>
                    Queda aislado por tenant y se reutiliza en futuras facturas.
                  </p>
                </div>
              </form>
            </StepCard>
          ) : null}

          {currentStep === 'identity' ? (
            <StepCard
              eyebrow="Paso 2 de 3"
              title="Confirma la identidad fiscal"
              trailing={
                <span className={styles.statusPillSuccess}>Revisar</span>
              }
            >
              {selectedCustomer ? (
                <>
                  <div className={styles.invoicingCustomerIdentityHeader}>
                    <span className={styles.invoicingCustomerAvatarLarge}>
                      {getCustomerInitials(selectedCustomer.name)}
                    </span>
                    <div>
                      <strong>{selectedCustomer.name}</strong>
                      <small>
                        {selectedCustomer.identificationType
                          ? `${selectedCustomer.identificationType} · ${
                              getBuyerIdentificationType(
                                selectedCustomer.identificationType,
                              )?.label ?? 'Identificacion'
                            }`
                          : 'Sin tipo de identificacion'}
                      </small>
                    </div>
                  </div>
                  <div className={styles.invoicingCustomerFacts}>
                    <FieldFact
                      label="Tipo"
                      value={
                        selectedCustomer.identificationType
                          ? `${selectedCustomer.identificationType} · ${formatBuyerIdentificationType(
                              selectedCustomer.identificationType,
                            )}`
                          : null
                      }
                    />
                    <FieldFact
                      label="Identificacion"
                      mono
                      value={
                        selectedCustomer.identification ??
                        selectedCustomer.taxId
                      }
                    />
                    <FieldFact label="Email" value={selectedCustomer.email} />
                    <FieldFact
                      label="Direccion"
                      value={selectedCustomer.billingAddress}
                    />
                  </div>
                  <div className={styles.invoicingCustomerInfoNote}>
                    <strong>Borrador, no SRI.</strong>
                    <span>
                      Estos datos identifican al comprador en la factura. El
                      envio, firma y autorizacion electronica se manejan
                      despues.
                    </span>
                  </div>
                  <div className={styles.inlineActionRow}>
                    <button
                      className={styles.primaryButton}
                      onClick={() => setCurrentStep('draft')}
                      type="button"
                    >
                      Confirmar y crear borrador
                    </button>
                    <button
                      className={styles.secondaryButton}
                      onClick={() => setCurrentStep('buyer')}
                      type="button"
                    >
                      Elegir otro comprador
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.emptyState}>
                  <p>Elige un comprador primero para confirmar su identidad.</p>
                  <button
                    className={styles.primaryButton}
                    onClick={() => setCurrentStep('buyer')}
                    type="button"
                  >
                    Volver a comprador
                  </button>
                </div>
              )}
            </StepCard>
          ) : null}

          {currentStep === 'draft' ? (
            <StepCard
              eyebrow="Paso 3 de 3"
              title="Crear borrador de factura"
              trailing={
                <span className={styles.statusPill}>Draft primero</span>
              }
            >
              {!hasCustomers ? (
                <div className={styles.emptyState}>
                  <strong>Primero necesitas un comprador</strong>
                  <p>
                    No se puede crear un borrador sin un comprador con datos
                    fiscales.
                  </p>
                  <button
                    className={styles.primaryButton}
                    onClick={() => setCurrentStep('buyer')}
                    type="button"
                  >
                    Ir a crear comprador
                  </button>
                </div>
              ) : (
                <form className={styles.stack} onSubmit={invoiceForm.onSubmit}>
                  <div className={styles.invoiceInlineGrid}>
                    <label className={styles.field}>
                      <span>Comprador</span>
                      <select
                        className={styles.selectField}
                        onChange={(event) =>
                          invoiceForm.onCustomerIdChange(event.target.value)
                        }
                        value={invoiceForm.customerId}
                      >
                        <option value="">Selecciona un comprador</option>
                        {customers.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className={styles.field}>
                      <span>Numero</span>
                      <input
                        className={styles.monoValue}
                        onChange={(event) =>
                          invoiceForm.onNumberChange(event.target.value)
                        }
                        placeholder={nextInvoiceNumberSuggestion}
                        value={invoiceForm.number}
                      />
                      <small className={styles.fieldHint}>
                        Vacio = se autogenera ({nextInvoiceNumberSuggestion}).
                      </small>
                    </label>
                  </div>
                  <div className={styles.invoiceInlineGrid}>
                    <label className={styles.field}>
                      <span>Moneda</span>
                      <input
                        className={styles.monoValue}
                        maxLength={3}
                        onChange={(event) =>
                          invoiceForm.onCurrencyChange(
                            event.target.value.toUpperCase(),
                          )
                        }
                        placeholder="USD"
                        value={invoiceForm.currency}
                      />
                    </label>
                    <label className={styles.field}>
                      <span>Estado</span>
                      <select
                        className={styles.selectField}
                        onChange={(event) =>
                          invoiceForm.onStatusChange(event.target.value)
                        }
                        value={invoiceForm.status}
                      >
                        <option value="draft">draft · borrador</option>
                        <option value="issued">issued · emitida</option>
                        <option value="paid">paid · pagada</option>
                        <option value="void">void · anulada</option>
                      </select>
                      <small className={styles.fieldHint}>
                        Usa draft para ir agregando items.
                      </small>
                    </label>
                  </div>
                  <label className={styles.field}>
                    <span>Vence el</span>
                    <input
                      onChange={(event) =>
                        invoiceForm.onDueAtChange(event.target.value)
                      }
                      type="date"
                      value={invoiceForm.dueAt}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Notas</span>
                    <textarea
                      onChange={(event) =>
                        invoiceForm.onNotesChange(event.target.value)
                      }
                      placeholder="Notas opcionales para la factura"
                      value={invoiceForm.notes}
                    />
                  </label>
                  <div className={styles.inlineActionRow}>
                    <button
                      className={styles.primaryButton}
                      disabled={
                        customers.length === 0 ||
                        !invoiceForm.customerId ||
                        !invoiceForm.currency.trim() ||
                        actionLoading === 'create-invoice'
                      }
                      type="submit"
                    >
                      {actionLoading === 'create-invoice'
                        ? 'Creando factura...'
                        : 'Crear borrador'}
                    </button>
                    <p className={styles.muted}>
                      Crear el borrador no lo envia al SRI. Despues agregas
                      items y preparas la emision.
                    </p>
                  </div>
                </form>
              )}
            </StepCard>
          ) : null}
        </div>

        <aside className={styles.invoicingCustomerFlowRail}>
          <FlowRail
            currentStep={currentStep}
            draftIsReady={draftIsReady}
            flowState={flowState}
            hasCustomers={hasCustomers}
            invoiceCurrency={invoiceForm.currency}
            invoiceNumber={invoiceForm.number}
            invoiceStatus={invoiceForm.status}
            nextInvoiceNumberSuggestion={nextInvoiceNumberSuggestion}
            selectedCustomer={selectedCustomer}
          />
          <div className={styles.invoicingCustomerSRIReassurance}>
            <strong>Esto no es una emision al SRI.</strong>
            <p>
              Aqui solo creas el comprador y el borrador. Los items, la firma y
              el envio electronico vienen despues, en sus propias pantallas.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

function FlowRail({
  currentStep,
  draftIsReady,
  flowState,
  hasCustomers,
  invoiceCurrency,
  invoiceNumber,
  invoiceStatus,
  nextInvoiceNumberSuggestion,
  selectedCustomer,
}: {
  currentStep: CustomerDraftFlowStep;
  draftIsReady: boolean;
  flowState: ReturnType<typeof deriveFlowState>;
  hasCustomers: boolean;
  invoiceCurrency: string;
  invoiceNumber: string;
  invoiceStatus: string;
  nextInvoiceNumberSuggestion: string;
  selectedCustomer: CustomerResponse | null;
}) {
  const railItems: Array<{
    key: CustomerDraftFlowStep;
    label: string;
    value: string;
  }> = [
    {
      key: 'buyer',
      label: 'Comprador',
      value: selectedCustomer
        ? selectedCustomer.name
        : hasCustomers
          ? 'Pendiente de elegir'
          : 'Sin compradores',
    },
    {
      key: 'identity',
      label: 'Identidad fiscal',
      value: selectedCustomer
        ? getBuyerIdentificationLabel(selectedCustomer)
        : 'Pendiente',
    },
    {
      key: 'draft',
      label: 'Borrador',
      value: draftIsReady ? 'Listo para crear' : 'Pendiente',
    },
  ];

  return (
    <div className={styles.invoicingCustomerRailCard}>
      <div>
        <span className={styles.label}>Resumen del flujo</span>
        <h3>Primera factura</h3>
      </div>
      <div className={styles.invoicingCustomerRailTimeline}>
        {railItems.map((item, index) => {
          const isDone = flowState.done.has(item.key);
          const isCurrent = currentStep === item.key;

          return (
            <div
              className={[
                styles.invoicingCustomerRailTimelineItem,
                isCurrent ? styles.invoicingCustomerRailTimelineItemActive : '',
                isDone ? styles.invoicingCustomerRailTimelineItemDone : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={item.key}
            >
              <span>{isDone ? 'OK' : index + 1}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{item.value}</small>
              </div>
            </div>
          );
        })}
      </div>
      <div className={styles.invoicingCustomerDraftPreview}>
        <span className={styles.label}>Borrador a crear</span>
        <strong className={styles.monoValue}>
          {invoiceNumber || nextInvoiceNumberSuggestion}
        </strong>
        <div>
          <span>{invoiceCurrency || 'USD'}</span>
          <span>{invoiceStatus || 'draft'}</span>
        </div>
      </div>
    </div>
  );
}
