import { FormEvent } from 'react';
import styles from './app.module.css';
import {
  AiMemoryRecordDetailResponse,
  AiMemoryRecordResponse,
  AiMemoryWorkspaceAgentResponse,
  AiMemoryWorkspaceResponse,
  AiRetrievalWorkspaceResponse,
} from './types';

type MemoryScope = 'tenant' | 'domain' | 'agent';
type MemoryDomainKey = 'growth' | 'invoicing' | 'ecommerce';
type MemoryFreshness = 'working_memory' | 'durable_memory';
type MemorySourceKind =
  | 'operator_note'
  | 'approval_memory'
  | 'guarded_execution_memory';

type Props = {
  formatDate: (value: string | null) => string;
  humanizeKey: (value: string | null) => string;
  actionLoading: string | null;
  growthActionLoading: string | null;
  tenantAiMemoryWorkspace: AiMemoryWorkspaceResponse | null;
  tenantAiMemoryWorkspaceLoading: boolean;
  tenantAiMemoryRecords: AiMemoryRecordResponse[];
  tenantAiMemoryRecordsLoading: boolean;
  selectedTenantAiMemoryRecordId: string | null;
  setSelectedTenantAiMemoryRecordId: (value: string | null) => void;
  selectedTenantAiMemoryRecordDetail: AiMemoryRecordDetailResponse | null;
  selectedTenantAiMemoryRecordDetailLoading: boolean;
  tenantAiRetrievalWorkspace: AiRetrievalWorkspaceResponse | null;
  tenantAiRetrievalWorkspaceLoading: boolean;
  visibleAiMemoryDomainKeys: MemoryDomainKey[];
  visibleAiMemoryAgents: AiMemoryWorkspaceAgentResponse[];
  newAiMemoryScope: MemoryScope;
  setNewAiMemoryScope: (value: MemoryScope) => void;
  newAiMemoryDomainKey: MemoryDomainKey;
  setNewAiMemoryDomainKey: (value: MemoryDomainKey) => void;
  newAiMemoryAgentKey: string;
  setNewAiMemoryAgentKey: (value: string) => void;
  newAiMemoryTitle: string;
  setNewAiMemoryTitle: (value: string) => void;
  newAiMemorySummary: string;
  setNewAiMemorySummary: (value: string) => void;
  newAiMemoryDetail: string;
  setNewAiMemoryDetail: (value: string) => void;
  newAiMemoryTags: string;
  setNewAiMemoryTags: (value: string) => void;
  newAiMemoryFreshness: MemoryFreshness;
  setNewAiMemoryFreshness: (value: MemoryFreshness) => void;
  newAiMemorySourceKind: MemorySourceKind;
  setNewAiMemorySourceKind: (value: MemorySourceKind) => void;
  editingAiMemoryTitle: string;
  setEditingAiMemoryTitle: (value: string) => void;
  editingAiMemorySummary: string;
  setEditingAiMemorySummary: (value: string) => void;
  editingAiMemoryDetail: string;
  setEditingAiMemoryDetail: (value: string) => void;
  editingAiMemoryTags: string;
  setEditingAiMemoryTags: (value: string) => void;
  editingAiMemoryFreshness: MemoryFreshness;
  setEditingAiMemoryFreshness: (value: MemoryFreshness) => void;
  editingAiMemorySourceKind: MemorySourceKind;
  setEditingAiMemorySourceKind: (value: MemorySourceKind) => void;
  onCreateAiMemoryRecord: (
    event: FormEvent<HTMLFormElement>,
  ) => void | Promise<void>;
  onUpdateAiMemoryRecord: (
    nextStatus?: 'active' | 'inactive',
  ) => void | Promise<void>;
  onOpenSuggestionRunDetail: (runId: string) => void | Promise<void>;
  onReviewApprovalRequest: (
    agentKey: string,
    requestId: string,
    status: 'approved' | 'rejected',
  ) => void | Promise<void>;
  getAiAgentActionLoadingState: (agentKey: string) => string | null;
  getTenantAiWorkspaceApprovalReviewActionKey: (
    agentKey: string,
    requestId: string,
  ) => string;
};

export function AiMemoryRetrievalSection({
  formatDate,
  humanizeKey,
  actionLoading,
  growthActionLoading,
  tenantAiMemoryWorkspace,
  tenantAiMemoryWorkspaceLoading,
  tenantAiMemoryRecords,
  tenantAiMemoryRecordsLoading,
  selectedTenantAiMemoryRecordId,
  setSelectedTenantAiMemoryRecordId,
  selectedTenantAiMemoryRecordDetail,
  selectedTenantAiMemoryRecordDetailLoading,
  tenantAiRetrievalWorkspace,
  tenantAiRetrievalWorkspaceLoading,
  visibleAiMemoryDomainKeys,
  visibleAiMemoryAgents,
  newAiMemoryScope,
  setNewAiMemoryScope,
  newAiMemoryDomainKey,
  setNewAiMemoryDomainKey,
  newAiMemoryAgentKey,
  setNewAiMemoryAgentKey,
  newAiMemoryTitle,
  setNewAiMemoryTitle,
  newAiMemorySummary,
  setNewAiMemorySummary,
  newAiMemoryDetail,
  setNewAiMemoryDetail,
  newAiMemoryTags,
  setNewAiMemoryTags,
  newAiMemoryFreshness,
  setNewAiMemoryFreshness,
  newAiMemorySourceKind,
  setNewAiMemorySourceKind,
  editingAiMemoryTitle,
  setEditingAiMemoryTitle,
  editingAiMemorySummary,
  setEditingAiMemorySummary,
  editingAiMemoryDetail,
  setEditingAiMemoryDetail,
  editingAiMemoryTags,
  setEditingAiMemoryTags,
  editingAiMemoryFreshness,
  setEditingAiMemoryFreshness,
  editingAiMemorySourceKind,
  setEditingAiMemorySourceKind,
  onCreateAiMemoryRecord,
  onUpdateAiMemoryRecord,
  onOpenSuggestionRunDetail,
  onReviewApprovalRequest,
  getAiAgentActionLoadingState,
  getTenantAiWorkspaceApprovalReviewActionKey,
}: Props) {
  return (
    <>
      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Tenant AI memory</span>
            <h3>Memoria operativa por agente y dominio</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiMemoryWorkspace
              ? formatDate(tenantAiMemoryWorkspace.generatedAt)
              : 'sin memoria'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes activos</span>
            <strong>{tenantAiMemoryWorkspace?.counts.totalAgents ?? 0}</strong>
            <small>Agentes AI listos y visibles en este tenant.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Con handoffs</span>
            <strong>
              {tenantAiMemoryWorkspace?.counts.agentsWithSuggestionRuns ?? 0}
            </strong>
            <small>Agentes que ya prepararon al menos un handoff.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Con approvals pendientes</span>
            <strong>
              {tenantAiMemoryWorkspace?.counts.agentsWithPendingApprovals ?? 0}
            </strong>
            <small>Agentes que hoy esperan revisión humana.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Pending approvals</span>
            <strong>
              {tenantAiMemoryWorkspace?.counts.totalPendingApprovalRequests ?? 0}
            </strong>
            <small>Backlog humano que la memoria operativa recuerda.</small>
          </div>
        </div>

        <form className={styles.stack} onSubmit={onCreateAiMemoryRecord}>
          <div className={styles.invoiceInlineGrid}>
            <label className={styles.field}>
              <span>Scope</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  setNewAiMemoryScope(
                    event.target.value as 'tenant' | 'domain' | 'agent',
                  )
                }
                value={newAiMemoryScope}
              >
                <option value="tenant">Tenant</option>
                <option value="domain">Domain</option>
                <option value="agent">Agent</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Freshness</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  setNewAiMemoryFreshness(
                    event.target.value as 'working_memory' | 'durable_memory',
                  )
                }
                value={newAiMemoryFreshness}
              >
                <option value="working_memory">Working memory</option>
                <option value="durable_memory">Durable memory</option>
              </select>
            </label>
            <label className={styles.field}>
              <span>Source</span>
              <select
                className={styles.selectField}
                onChange={(event) =>
                  setNewAiMemorySourceKind(
                    event.target.value as
                      | 'operator_note'
                      | 'approval_memory'
                      | 'guarded_execution_memory',
                  )
                }
                value={newAiMemorySourceKind}
              >
                <option value="operator_note">Operator note</option>
                <option value="approval_memory">Approval memory</option>
                <option value="guarded_execution_memory">
                  Guarded execution memory
                </option>
              </select>
            </label>
          </div>

          {(newAiMemoryScope === 'domain' || newAiMemoryScope === 'agent') && (
            <div className={styles.invoiceInlineGrid}>
              <label className={styles.field}>
                <span>Domain</span>
                <select
                  className={styles.selectField}
                  onChange={(event) =>
                    setNewAiMemoryDomainKey(
                      event.target.value as 'growth' | 'invoicing' | 'ecommerce',
                    )
                  }
                  value={newAiMemoryDomainKey}
                >
                  {visibleAiMemoryDomainKeys.map((domainKey) => (
                    <option key={`ai-memory-domain:${domainKey}`} value={domainKey}>
                      {humanizeKey(domainKey)}
                    </option>
                  ))}
                </select>
              </label>
              {newAiMemoryScope === 'agent' ? (
                <label className={styles.field}>
                  <span>Agent</span>
                  <select
                    className={styles.selectField}
                    onChange={(event) => setNewAiMemoryAgentKey(event.target.value)}
                    value={newAiMemoryAgentKey}
                  >
                    {visibleAiMemoryAgents
                      .filter((agent) => agent.domainKey === newAiMemoryDomainKey)
                      .map((agent) => (
                        <option
                          key={`ai-memory-agent:${agent.agentKey}`}
                          value={agent.agentKey}
                        >
                          {agent.title}
                        </option>
                      ))}
                  </select>
                </label>
              ) : null}
            </div>
          )}

          <label className={styles.field}>
            <span>Titulo</span>
            <input
              onChange={(event) => setNewAiMemoryTitle(event.target.value)}
              placeholder="Lead routing preference"
              value={newAiMemoryTitle}
            />
          </label>
          <label className={styles.field}>
            <span>Resumen corto</span>
            <input
              onChange={(event) => setNewAiMemorySummary(event.target.value)}
              placeholder="Priorizar reasignacion manual cuando el queue llegue caliente."
              value={newAiMemorySummary}
            />
          </label>
          <label className={styles.field}>
            <span>Detalle operativo</span>
            <textarea
              onChange={(event) => setNewAiMemoryDetail(event.target.value)}
              placeholder="Explica la regla, el contexto y la razon de negocio que el agente debe recordar."
              value={newAiMemoryDetail}
            />
          </label>
          <label className={styles.field}>
            <span>Tags</span>
            <input
              onChange={(event) => setNewAiMemoryTags(event.target.value)}
              placeholder="routing, hot-leads"
              value={newAiMemoryTags}
            />
          </label>
          <div className={styles.inlineActions}>
            <button
              className={styles.primaryButton}
              disabled={
                !newAiMemoryTitle.trim() ||
                !newAiMemorySummary.trim() ||
                !newAiMemoryDetail.trim() ||
                actionLoading === 'create-ai-memory-record'
              }
              type="submit"
            >
              {actionLoading === 'create-ai-memory-record'
                ? 'Guardando memoria...'
                : 'Guardar memory record'}
            </button>
            <small className={styles.muted}>
              Esta nota queda persistida y luego puede entrar al retrieval de los
              agentes visibles para este tenant.
            </small>
          </div>
        </form>

        <div className={styles.stack}>
          {tenantAiMemoryRecords.length ? (
            tenantAiMemoryRecords.map((record) => (
              <div
                className={styles.timelineCard}
                key={`ai-memory-record:${record.id}`}
                onClick={() => setSelectedTenantAiMemoryRecordId(record.id)}
                role="button"
                style={{
                  borderColor:
                    selectedTenantAiMemoryRecordId === record.id
                      ? 'rgba(0, 114, 178, 0.45)'
                      : undefined,
                  cursor: 'pointer',
                }}
              >
                <div className={styles.invoiceCardHeader}>
                  <strong>{record.title}</strong>
                  <div className={styles.inlineActions}>
                    <span className={styles.statusPill}>
                      {humanizeKey(record.scope)}
                    </span>
                    <span className={styles.statusPill}>
                      {humanizeKey(record.status)}
                    </span>
                  </div>
                </div>
                <small>{record.summary}</small>
                <small>
                  {record.agentKey
                    ? `Agent ${record.agentKey}`
                    : record.domainKey
                      ? `Domain ${record.domainKey}`
                      : 'Tenant-wide memory'}
                </small>
                <small>
                  Source {humanizeKey(record.sourceKind)} · freshness{' '}
                  {humanizeKey(record.freshness)} · updated{' '}
                  {formatDate(record.updatedAt)}
                </small>
              </div>
            ))
          ) : tenantAiMemoryRecordsLoading ? (
            <small className={styles.muted}>Cargando memory records de AI...</small>
          ) : (
            <small className={styles.muted}>
              Todavía no hay memory records persistidos desde la consola.
            </small>
          )}
        </div>

        <div className={styles.detailCard}>
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.label}>Memory Provenance</span>
              <h3>Donde se uso esta memoria y si sigue entrando al contexto</h3>
            </div>
            <span className={styles.statusPill}>
              {selectedTenantAiMemoryRecordDetail
                ? humanizeKey(selectedTenantAiMemoryRecordDetail.record.status)
                : 'sin detalle'}
            </span>
          </div>

          {selectedTenantAiMemoryRecordDetail ? (
            <div className={styles.stack}>
              <div className={styles.commercialMetricsGrid}>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Visible ahora</span>
                  <strong>
                    {selectedTenantAiMemoryRecordDetail.currentRetrieval.agentCount}
                  </strong>
                  <small>Agentes visibles que hidratarian este record hoy.</small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Usos persistidos</span>
                  <strong>
                    {selectedTenantAiMemoryRecordDetail.provenance.usageCount}
                  </strong>
                  <small>Suggestion runs ya guardados que lo referencian.</small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Agentes con uso</span>
                  <strong>
                    {selectedTenantAiMemoryRecordDetail.provenance.agentsUsingCount}
                  </strong>
                  <small>Agentes distintos donde ya aparecio esta memoria.</small>
                </div>
                <div className={styles.commercialCard}>
                  <span className={styles.muted}>Ultimo uso</span>
                  <strong>
                    {selectedTenantAiMemoryRecordDetail.provenance.latestUsedAt
                      ? formatDate(
                          selectedTenantAiMemoryRecordDetail.provenance.latestUsedAt,
                        )
                      : 'nunca'}
                  </strong>
                  <small>Trazabilidad de envelopes persistidos.</small>
                </div>
              </div>

              <div className={styles.invoiceInlineGrid}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input
                    onChange={(event) => setEditingAiMemoryTitle(event.target.value)}
                    value={editingAiMemoryTitle}
                  />
                </label>
                <label className={styles.field}>
                  <span>Freshness</span>
                  <select
                    className={styles.selectField}
                    onChange={(event) =>
                      setEditingAiMemoryFreshness(
                        event.target.value as 'working_memory' | 'durable_memory',
                      )
                    }
                    value={editingAiMemoryFreshness}
                  >
                    <option value="working_memory">Working memory</option>
                    <option value="durable_memory">Durable memory</option>
                  </select>
                </label>
                <label className={styles.field}>
                  <span>Source</span>
                  <select
                    className={styles.selectField}
                    onChange={(event) =>
                      setEditingAiMemorySourceKind(
                        event.target.value as
                          | 'operator_note'
                          | 'approval_memory'
                          | 'guarded_execution_memory',
                      )
                    }
                    value={editingAiMemorySourceKind}
                  >
                    <option value="operator_note">Operator note</option>
                    <option value="approval_memory">Approval memory</option>
                    <option value="guarded_execution_memory">
                      Guarded execution memory
                    </option>
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span>Summary</span>
                <input
                  onChange={(event) => setEditingAiMemorySummary(event.target.value)}
                  value={editingAiMemorySummary}
                />
              </label>
              <label className={styles.field}>
                <span>Detail</span>
                <textarea
                  onChange={(event) => setEditingAiMemoryDetail(event.target.value)}
                  value={editingAiMemoryDetail}
                />
              </label>
              <label className={styles.field}>
                <span>Tags</span>
                <input
                  onChange={(event) => setEditingAiMemoryTags(event.target.value)}
                  value={editingAiMemoryTags}
                />
              </label>

              <div className={styles.inlineActions}>
                <button
                  className={styles.primaryButton}
                  type="button"
                  onClick={() => {
                    void onUpdateAiMemoryRecord();
                  }}
                  disabled={
                    !editingAiMemoryTitle.trim() ||
                    !editingAiMemorySummary.trim() ||
                    !editingAiMemoryDetail.trim() ||
                    actionLoading ===
                      `update-ai-memory-record:${selectedTenantAiMemoryRecordDetail.record.id}`
                  }
                >
                  {actionLoading ===
                  `update-ai-memory-record:${selectedTenantAiMemoryRecordDetail.record.id}`
                    ? 'Guardando cambios...'
                    : 'Guardar cambios'}
                </button>
                <button
                  className={styles.secondaryButton}
                  type="button"
                  onClick={() => {
                    void onUpdateAiMemoryRecord(
                      selectedTenantAiMemoryRecordDetail.record.status === 'active'
                        ? 'inactive'
                        : 'active',
                    );
                  }}
                  disabled={
                    actionLoading ===
                    `update-ai-memory-record:${selectedTenantAiMemoryRecordDetail.record.id}`
                  }
                >
                  {selectedTenantAiMemoryRecordDetail.record.status === 'active'
                    ? 'Desactivar memoria'
                    : 'Reactivar memoria'}
                </button>
                <small className={styles.muted}>
                  El scope y el binding tenant/domain/agent quedan fijos para no
                  romper provenance historico.
                </small>
              </div>

              <div className={styles.stack}>
                {selectedTenantAiMemoryRecordDetail.currentRetrieval.notes.map(
                  (note, index) => (
                    <small key={`ai-memory-current-note:${index}`}>{note}</small>
                  ),
                )}
              </div>

              {selectedTenantAiMemoryRecordDetail.currentRetrieval.agents.length ? (
                <div className={styles.stack}>
                  {selectedTenantAiMemoryRecordDetail.currentRetrieval.agents.map(
                    (agent) => (
                      <div
                        className={styles.timelineCard}
                        key={`ai-memory-current-agent:${agent.agentKey}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{agent.title}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(agent.domainKey)}
                          </span>
                        </div>
                        <small>{agent.inclusionReason}</small>
                      </div>
                    ),
                  )}
                </div>
              ) : null}

              <div className={styles.stack}>
                {selectedTenantAiMemoryRecordDetail.provenance.notes.map(
                  (note, index) => (
                    <small key={`ai-memory-provenance-note:${index}`}>{note}</small>
                  ),
                )}
              </div>

              {selectedTenantAiMemoryRecordDetail.provenance.recentSuggestionRuns
                .length ? (
                <div className={styles.stack}>
                  {selectedTenantAiMemoryRecordDetail.provenance.recentSuggestionRuns.map(
                    (entry) => (
                      <div
                        className={styles.timelineCard}
                        key={`ai-memory-usage:${entry.suggestionRunId}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{entry.agentKey}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(entry.memoryScope)}
                          </span>
                        </div>
                        <small>{entry.summary}</small>
                        <small>
                          Surface {entry.surfaceKey} · prompt pack {entry.promptPackKey}@
                          {entry.promptPackVersion}
                        </small>
                        <small>
                          {entry.memoryInclusionReason ??
                            'Sin razon de inclusion registrada.'}
                        </small>
                        <small>Persistido {formatDate(entry.createdAt)}</small>
                      </div>
                    ),
                  )}
                </div>
              ) : null}
            </div>
          ) : selectedTenantAiMemoryRecordDetailLoading ? (
            <small className={styles.muted}>
              Cargando detalle y provenance de memoria de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Selecciona un memory record para ver su provenance y operar su
                lifecycle.
              </p>
            </div>
          )}
        </div>

        <div className={styles.stack}>
          {tenantAiMemoryWorkspace?.agents.length ? (
            tenantAiMemoryWorkspace.agents.map((agent) => (
              <div className={styles.assistCueCard} key={`ai-memory:${agent.agentKey}`}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span className={styles.statusPill}>
                    {humanizeKey(agent.domainKey)}
                  </span>
                </div>
                <small>
                  Prompt pack {agent.promptPack.key}@{agent.promptPack.version} ·{' '}
                  {agent.promptPack.mode}
                </small>
                <small>
                  Tool posture: {agent.toolAccessSummary.allowedCount} allowed,{' '}
                  {agent.toolAccessSummary.approvalRequiredCount} approval-required,{' '}
                  {agent.toolAccessSummary.blockedCount} blocked
                </small>
                {agent.recentActivityAt ? (
                  <small>Última actividad {formatDate(agent.recentActivityAt)}</small>
                ) : null}
                <div className={styles.stack}>
                  {agent.memoryNotes.map((note, index) => (
                    <small key={`ai-memory-note:${agent.agentKey}:${index}`}>{note}</small>
                  ))}
                </div>
                <div className={styles.inlineActions}>
                  {agent.latestSuggestionRun ? (
                    <button
                      className={styles.ghostButton}
                      type="button"
                      onClick={() => {
                        void onOpenSuggestionRunDetail(agent.latestSuggestionRun!.id);
                      }}
                      disabled={
                        growthActionLoading ===
                        `load-tenant-ai-run-detail:${agent.latestSuggestionRun.id}`
                      }
                    >
                      Abrir último handoff
                    </button>
                  ) : null}
                  {agent.oldestPendingApprovalRequest ? (
                    <button
                      className={styles.secondaryButton}
                      type="button"
                      onClick={() => {
                        void onReviewApprovalRequest(
                          agent.agentKey,
                          agent.oldestPendingApprovalRequest!.id,
                          'approved',
                        );
                      }}
                      disabled={
                        getAiAgentActionLoadingState(agent.agentKey) ===
                        getTenantAiWorkspaceApprovalReviewActionKey(
                          agent.agentKey,
                          agent.oldestPendingApprovalRequest.id,
                        )
                      }
                    >
                      Aprobar pendiente más antiguo
                    </button>
                  ) : null}
                </div>
              </div>
            ))
          ) : tenantAiMemoryWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando memoria transversal de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                La memoria operativa todavía no tiene suficientes señales para este
                tenant.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.detailCard}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.label}>Tenant AI retrieval</span>
            <h3>Qué memoria entra al contexto y por qué</h3>
          </div>
          <span className={styles.statusPill}>
            {tenantAiRetrievalWorkspace
              ? formatDate(tenantAiRetrievalWorkspace.generatedAt)
              : 'sin retrieval'}
          </span>
        </div>

        <div className={styles.commercialMetricsGrid}>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Agentes evaluados</span>
            <strong>{tenantAiRetrievalWorkspace?.counts.totalAgents ?? 0}</strong>
            <small>Agentes AI visibles para hydration contextual.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Con memoria</span>
            <strong>{tenantAiRetrievalWorkspace?.counts.agentsWithMemory ?? 0}</strong>
            <small>Agentes que ya reciben memoria persistida en su contexto.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Records recuperados</span>
            <strong>
              {tenantAiRetrievalWorkspace?.counts.totalRetrievedRecords ?? 0}
            </strong>
            <small>Entradas de memoria que hoy entran al retrieval.</small>
          </div>
          <div className={styles.commercialCard}>
            <span className={styles.muted}>Records únicos</span>
            <strong>
              {tenantAiRetrievalWorkspace?.counts.uniqueRetrievedRecords ?? 0}
            </strong>
            <small>
              Memoria persistida distinta, sin contar repeticiones por agente.
            </small>
          </div>
        </div>

        <div className={styles.stack}>
          {tenantAiRetrievalWorkspace?.agents.length ? (
            tenantAiRetrievalWorkspace.agents.map((agent) => (
              <div className={styles.assistCueCard} key={`ai-retrieval:${agent.agentKey}`}>
                <div className={styles.invoiceCardHeader}>
                  <strong>{agent.title}</strong>
                  <span className={styles.statusPill}>
                    {humanizeKey(agent.domainKey)}
                  </span>
                </div>
                <small>
                  {agent.retrieval.recordCount} record(s) entran hoy al contexto de este
                  agente.
                </small>
                <div className={styles.stack}>
                  {agent.retrieval.notes.map((note, index) => (
                    <small key={`ai-retrieval-note:${agent.agentKey}:${index}`}>{note}</small>
                  ))}
                </div>
                {agent.retrieval.records.length ? (
                  <div className={styles.stack}>
                    {agent.retrieval.records.map((record) => (
                      <div
                        className={styles.timelineCard}
                        key={`ai-retrieval-record:${agent.agentKey}:${record.id}`}
                      >
                        <div className={styles.invoiceCardHeader}>
                          <strong>{record.title}</strong>
                          <span className={styles.statusPill}>
                            {humanizeKey(record.scope)}
                          </span>
                        </div>
                        <small>{record.summary}</small>
                        <small>{record.inclusionReason}</small>
                        <small>
                          Source {humanizeKey(record.sourceKind)} · freshness{' '}
                          {humanizeKey(record.freshness)} · updated{' '}
                          {formatDate(record.lastUpdatedAt)}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : tenantAiRetrievalWorkspaceLoading ? (
            <small className={styles.muted}>
              Cargando retrieval workspace transversal de AI...
            </small>
          ) : (
            <div className={styles.emptyState}>
              <p>
                Todavía no hay memoria persistida suficiente como para hidratar
                contexto reutilizable en este tenant.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
