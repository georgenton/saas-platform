import type { ReactNode } from 'react';
import styles from '../../app/app.module.css';
import { Button, Banner } from '../../shared/design-system';
import {
  PLATFORM_MOODS,
  type PlatformMoodKey,
} from '../../shared/layout/platform-shell.model';
import type {
  AccessGatewayModel,
  AccessInvitationModel,
  AccessWorkspaceOption,
} from './model';

type AccessGatewayProps = {
  acceptInvitationBusy: boolean;
  model: AccessGatewayModel;
  onAcceptInvitation: (invitationId: string) => void;
  onAdvancedOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onMoodChange: (mood: PlatformMoodKey) => void;
  onResetSession: () => void;
  onSelectWorkspace: (tenantSlug: string) => void;
  onTokenInputChange: (value: string) => void;
  onUseToken: () => void;
  selectingWorkspaceSlug: string | null;
  sessionBusy: boolean;
  tokenBusy: boolean;
};

function MoodButtons({
  mood,
  onMoodChange,
}: {
  mood: PlatformMoodKey;
  onMoodChange: (mood: PlatformMoodKey) => void;
}) {
  return (
    <div className={styles.accessMoodButtons} aria-label="Elegir mood de interfaz" role="radiogroup">
      {PLATFORM_MOODS.map((entry) => (
        <button
          aria-checked={mood === entry.key}
          className={`${styles.accessMoodButton} ${
            mood === entry.key ? styles.accessMoodButtonActive : ''
          }`}
          key={entry.key}
          onClick={() => onMoodChange(entry.key)}
          role="radio"
          type="button"
        >
          <span className={styles.accessMoodSwatch} data-preview-mood={entry.key} />
          <span>{entry.label}</span>
        </button>
      ))}
    </div>
  );
}

function BrandPanel() {
  return (
    <aside className={styles.accessBrandPanel}>
      <div className={styles.accessBrandLockup}>
        <span className={styles.accessBrandMark}>SP</span>
        <div>
          <strong>SaaS Platform</strong>
          <small>Front desk operativo</small>
        </div>
      </div>

      <div className={styles.accessBrandContent}>
        <div>
          <span className={styles.eyebrow}>Workspace access</span>
          <h1>Entra con calma y sigue directo al lugar correcto.</h1>
          <p>
            Resolvemos tu sesion, tu invitacion o tu workspace antes de mostrar el
            resto del sistema.
          </p>
        </div>

        <div className={styles.accessCapabilityList}>
          {[
            'Facturacion electronica SRI',
            'Accounting',
            'Tax Compliance EC',
            'Ecommerce',
            'Growth',
            'Clinics',
          ].map((capability) => (
            <span className={styles.accessCapabilityChip} key={capability}>
              {capability}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.accessBrandFooter}>
        <span>Listo para pilotos controlados en Ecuador y LATAM.</span>
      </div>
    </aside>
  );
}

function AccessCard({
  eyebrow,
  title,
  body,
  children,
}: {
  body: string;
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <article className={styles.accessCard}>
      <div className={styles.accessCardHeader}>
        <span className={styles.label}>{eyebrow}</span>
        <h2>{title}</h2>
        <p>{body}</p>
      </div>
      {children}
    </article>
  );
}

function AdvancedTokenPanel({
  apiBaseUrl,
  error,
  open,
  tokenBusy,
  tokenInput,
  onOpenChange,
  onTokenInputChange,
  onUseToken,
}: {
  apiBaseUrl: string;
  error: string | null;
  open: boolean;
  tokenBusy: boolean;
  tokenInput: string;
  onOpenChange: (open: boolean) => void;
  onTokenInputChange: (value: string) => void;
  onUseToken: () => void;
}) {
  return (
    <div
      className={`${styles.accessAdvancedPanel} ${
        open ? styles.accessAdvancedPanelOpen : ''
      }`}
    >
      <button
        aria-expanded={open}
        className={styles.accessAdvancedToggle}
        onClick={() => onOpenChange(!open)}
        type="button"
      >
        <span>
          <strong>Acceso avanzado</strong>
          <small>Ya tengo un token · modo tecnico</small>
        </span>
        <em>{open ? 'Ocultar' : 'Abrir'}</em>
      </button>

      {open ? (
        <div className={styles.accessAdvancedBody}>
          {error ? <Banner tone="error">{error}</Banner> : null}
          <div className={styles.accessApiDiagnostic}>
            <span>API base</span>
            <code>{apiBaseUrl}</code>
          </div>
          <label className={styles.field}>
            <span>Bearer token</span>
            <textarea
              onChange={(event) => onTokenInputChange(event.target.value)}
              placeholder="Pega aqui el Bearer token del piloto o QA"
              rows={4}
              value={tokenInput}
            />
          </label>
          <div className={styles.accessAdvancedActions}>
            <Button
              disabled={!tokenInput.trim() || tokenBusy}
              onClick={onUseToken}
              variant="secondary"
            >
              {tokenBusy ? 'Verificando...' : 'Usar token'}
            </Button>
            <span>Solo en este dispositivo</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GatewayState({
  model,
  onAdvancedOpenChange,
  onContinue,
  onTokenInputChange,
  onUseToken,
  sessionBusy,
  tokenBusy,
}: {
  model: AccessGatewayModel;
  onAdvancedOpenChange: (open: boolean) => void;
  onContinue: () => void;
  onTokenInputChange: (value: string) => void;
  onUseToken: () => void;
  sessionBusy: boolean;
  tokenBusy: boolean;
}) {
  const hasInlineError = model.phase === 'backend-unavailable';
  const hasTokenError = model.phase === 'invalid-token';

  return (
    <AccessCard
      body={
        model.hasStoredToken
          ? 'Usaremos la sesion guardada en este dispositivo y te llevaremos al workspace correcto.'
          : 'Primero confirmamos tu acceso. Si estas en piloto o QA, puedes usar el carril avanzado.'
      }
      eyebrow={`Acceso · ${model.capabilities[0] ?? 'SaaS Platform'}`}
      title="Entra a tu espacio de trabajo"
    >
      {hasInlineError && model.sessionError ? (
        <Banner tone="error">{model.sessionError}</Banner>
      ) : null}

      <div className={styles.accessPrimaryActionBlock}>
        <Button onClick={onContinue}>
          {sessionBusy
            ? 'Verificando tu sesion...'
            : model.hasStoredToken
              ? 'Continuar'
              : 'Continuar'}
        </Button>
        <p>
          {model.hasStoredToken
            ? 'Si la sesion sigue vigente, entraras directo al command center.'
            : 'Si todavia no tienes una sesion guardada, abriremos el acceso avanzado.'}
        </p>
      </div>

      <div className={styles.accessFutureMethods}>
        <div className={styles.accessFutureMethodsDivider}>
          <span>Proximamente</span>
        </div>
        <div className={styles.accessFutureMethodList}>
          <div className={styles.accessFutureMethod}>Correo y password</div>
          <div className={styles.accessFutureMethod}>Enlace de acceso</div>
          <div className={styles.accessFutureMethod}>SSO</div>
        </div>
      </div>

      <AdvancedTokenPanel
        apiBaseUrl={model.apiBaseUrl}
        error={hasTokenError ? model.sessionError : null}
        onOpenChange={onAdvancedOpenChange}
        onTokenInputChange={onTokenInputChange}
        onUseToken={onUseToken}
        open={model.advancedOpen}
        tokenBusy={tokenBusy}
        tokenInput={model.tokenInput}
      />
    </AccessCard>
  );
}

function CheckingState() {
  return (
    <AccessCard
      body="Confirmamos tu acceso y resolvemos a que espacio de trabajo debes entrar."
      eyebrow="Verificando"
      title="Estamos preparando tu sesion"
    >
      <div className={styles.accessCheckingBlock}>
        <div className={styles.accessSpinner} />
        <strong>GET /api/auth/me</strong>
      </div>
    </AccessCard>
  );
}

function InvitationState({
  acceptInvitationBusy,
  invitation,
  onAcceptInvitation,
  onResetSession,
}: {
  acceptInvitationBusy: boolean;
  invitation: AccessInvitationModel | null;
  onAcceptInvitation: (invitationId: string) => void;
  onResetSession: () => void;
}) {
  if (!invitation) {
    return (
      <AccessCard
        body="Todavia estamos cargando los detalles de la invitacion pendiente."
        eyebrow="Invitacion"
        title="Revisando invitacion"
      >
        <div className={styles.accessCheckingBlock}>
          <div className={styles.accessSpinner} />
          <strong>GET /api/auth/invitations/:invitationId</strong>
        </div>
      </AccessCard>
    );
  }

  return (
    <AccessCard
      body="Revisa la empresa, el rol y el correo antes de aceptar."
      eyebrow="Invitacion pendiente"
      title={`Te invitaron a ${invitation.tenantName}`}
    >
      <dl className={styles.accessDetailList}>
        <div>
          <dt>Empresa</dt>
          <dd>{invitation.tenantName}</dd>
        </div>
        <div>
          <dt>Rol</dt>
          <dd>{invitation.roleLabel}</dd>
        </div>
        <div>
          <dt>Correo</dt>
          <dd>{invitation.email}</dd>
        </div>
        <div>
          <dt>Invitado por</dt>
          <dd>{invitation.invitedByLabel}</dd>
        </div>
        <div>
          <dt>Estado</dt>
          <dd>{invitation.statusLabel}</dd>
        </div>
        <div>
          <dt>Expira</dt>
          <dd>{invitation.expiresAtLabel}</dd>
        </div>
      </dl>

      <div className={styles.accessCardActionStack}>
        <Button
          disabled={!invitation.canAccept || acceptInvitationBusy}
          onClick={() => onAcceptInvitation(invitation.invitationId)}
        >
          {acceptInvitationBusy ? 'Aceptando...' : 'Aceptar invitacion'}
        </Button>
        <Button onClick={onResetSession} variant="ghost">
          Ahora no
        </Button>
      </div>
    </AccessCard>
  );
}

function WorkspaceSelectState({
  onResetSession,
  onSelectWorkspace,
  selectingWorkspaceSlug,
  workspaceOptions,
}: {
  onResetSession: () => void;
  onSelectWorkspace: (tenantSlug: string) => void;
  selectingWorkspaceSlug: string | null;
  workspaceOptions: AccessWorkspaceOption[];
}) {
  return (
    <AccessCard
      body="Tu cuenta ya tiene acceso. Solo falta elegir el workspace donde quieres operar ahora."
      eyebrow="Elige tu espacio"
      title="Donde quieres trabajar hoy?"
    >
      <div className={styles.accessWorkspaceList}>
        {workspaceOptions.map((workspace) => (
          <button
            className={styles.accessWorkspaceButton}
            disabled={Boolean(selectingWorkspaceSlug)}
            key={workspace.slug}
            onClick={() => onSelectWorkspace(workspace.slug)}
            type="button"
          >
            <span>
              <strong>{workspace.title}</strong>
              <small>{workspace.slug}</small>
            </span>
            <span>
              <strong>{workspace.roleLabel}</strong>
              <small>{workspace.permissionCount} permisos</small>
            </span>
            <em>
              {selectingWorkspaceSlug === workspace.slug ? 'Activando...' : 'Entrar'}
            </em>
          </button>
        ))}
      </div>

      <Button onClick={onResetSession} variant="ghost">
        Cerrar sesion
      </Button>
    </AccessCard>
  );
}

function NoTenantState({
  currentUserEmail,
  onResetSession,
}: {
  currentUserEmail: string | null;
  onResetSession: () => void;
}) {
  return (
    <AccessCard
      body="La sesion existe, pero todavia no pertenece a un workspace con acceso operativo."
      eyebrow="Sin workspace"
      title="Aun no tienes un espacio de trabajo activo"
    >
      <div className={styles.accessNoTenantBox}>
        <strong>{currentUserEmail ?? 'Sin email en claims'}</strong>
        <span>Pidele al owner que invite este correo o comparte un token de piloto.</span>
      </div>
      <Button onClick={onResetSession} variant="ghost">
        Cerrar sesion
      </Button>
    </AccessCard>
  );
}

export function AccessGateway({
  acceptInvitationBusy,
  model,
  onAcceptInvitation,
  onAdvancedOpenChange,
  onContinue,
  onMoodChange,
  onResetSession,
  onSelectWorkspace,
  onTokenInputChange,
  onUseToken,
  selectingWorkspaceSlug,
  sessionBusy,
  tokenBusy,
}: AccessGatewayProps) {
  let content: ReactNode;

  switch (model.phase) {
    case 'checking':
      content = <CheckingState />;
      break;
    case 'invitation':
      content = (
        <InvitationState
          acceptInvitationBusy={acceptInvitationBusy}
          invitation={model.invitation}
          onAcceptInvitation={onAcceptInvitation}
          onResetSession={onResetSession}
        />
      );
      break;
    case 'workspace-select':
      content = (
        <WorkspaceSelectState
          onResetSession={onResetSession}
          onSelectWorkspace={onSelectWorkspace}
          selectingWorkspaceSlug={selectingWorkspaceSlug}
          workspaceOptions={model.workspaceOptions}
        />
      );
      break;
    case 'no-tenant':
      content = (
        <NoTenantState
          currentUserEmail={model.currentUserEmail}
          onResetSession={onResetSession}
        />
      );
      break;
    case 'backend-unavailable':
    case 'invalid-token':
    case 'gateway':
    default:
      content = (
        <GatewayState
          model={model}
          onAdvancedOpenChange={onAdvancedOpenChange}
          onContinue={onContinue}
          onTokenInputChange={onTokenInputChange}
          onUseToken={onUseToken}
          sessionBusy={sessionBusy}
          tokenBusy={tokenBusy}
        />
      );
      break;
  }

  return (
    <div className={styles.accessGateway} data-mood={model.mood}>
      <div className={styles.accessGatewayShell}>
        <div className={styles.accessGatewayMoodDock}>
          <span>Apariencia</span>
          <MoodButtons mood={model.mood} onMoodChange={onMoodChange} />
        </div>
        <div className={styles.accessGatewayGrid}>
          <BrandPanel />
          <div className={styles.accessActionPane}>
            <div className={styles.accessActionPaneHeader}>
              <span className={styles.label}>Mood activo</span>
              <strong>
                {
                  PLATFORM_MOODS.find((entry) => entry.key === model.mood)?.label
                }
              </strong>
            </div>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
