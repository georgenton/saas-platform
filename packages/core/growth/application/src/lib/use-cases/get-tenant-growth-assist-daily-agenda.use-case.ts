import {
  GetTenantGrowthConversationWorkbenchUseCase,
  TenantGrowthConversationWorkbenchView,
} from './get-tenant-growth-conversation-workbench.use-case';
import {
  GetTenantWhatsappOutboundReportingSummaryUseCase,
  TenantWhatsappOutboundReportingSummaryView,
} from './get-tenant-whatsapp-outbound-reporting-summary.use-case';
import {
  GrowthOperationalCaseRecord,
} from '../ports/growth-operational-case.repository';
import { ListTenantGrowthOperationalCasesUseCase } from './list-tenant-growth-operational-cases.use-case';
import {
  GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
} from './get-tenant-growth-operational-case-auto-assignment-settings.use-case';

export interface TenantGrowthAssistTaskView {
  key: string;
  urgency: 'today' | 'soon' | 'watch';
  category: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  summary: string;
  actionLabel: string;
  dueAt: Date | null;
  threadId: string | null;
  operationalCaseId: string | null;
}

export interface TenantGrowthAssistConversationCueView {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  summary: string;
  suggestedReply: string;
  nextMove: string;
  threadId: string;
}

export interface TenantGrowthAssistReplySuggestionView {
  key: string;
  warmth: 'hot' | 'warm' | 'watch';
  title: string;
  reason: string;
  goal: string;
  suggestedReply: string;
  followUpPrompt: string;
  checklist: string[];
  threadId: string;
}

export interface TenantGrowthAssistNextActionView {
  key: string;
  emphasis: 'do_now' | 'today' | 'stabilize';
  actionType: 'reply_now' | 'follow_up' | 'assign_owner' | 'channel_risk';
  title: string;
  whyNow: string;
  recommendedAction: string;
  businessImpact: string;
  threadId: string | null;
  operationalCaseId: string | null;
}

export interface TenantGrowthAssistPlaybookView {
  key: string;
  title: string;
  detail: string;
  whenToUse: string;
  steps: string[];
}

export interface TenantGrowthAssistWaitingCustomerView {
  caseId: string;
  title: string;
  summary: string;
  nextAction: string;
  assignedUserEmail: string | null;
  dueAt: Date | null;
}

export interface TenantGrowthAssistDailyAgendaView {
  tenantSlug: string;
  generatedAt: Date;
  summary: {
    tone: 'healthy' | 'warning' | 'critical';
    headline: string;
    detail: string;
    replyNowCount: number;
    followUpNowCount: number;
    waitingCustomerCount: number;
    queueToOrganizeCount: number;
    channelRiskCount: number;
    savedPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first';
  };
  tasks: TenantGrowthAssistTaskView[];
  conversationCues: TenantGrowthAssistConversationCueView[];
  replySuggestions: TenantGrowthAssistReplySuggestionView[];
  nextActions: TenantGrowthAssistNextActionView[];
  playbooks: TenantGrowthAssistPlaybookView[];
  waitingCustomerQueue: TenantGrowthAssistWaitingCustomerView[];
  channelHealth: {
    overallStatus: 'healthy' | 'warning' | 'critical';
    totalAlertCount: number;
    readyRetryCount: number;
    topAlertTitle: string | null;
    topAlertSummary: string | null;
    topAlertRecommendedAction: string | null;
  };
}

export class GetTenantGrowthAssistDailyAgendaUseCase {
  constructor(
    private readonly getTenantGrowthConversationWorkbenchUseCase: GetTenantGrowthConversationWorkbenchUseCase,
    private readonly getTenantWhatsappOutboundReportingSummaryUseCase: GetTenantWhatsappOutboundReportingSummaryUseCase,
    private readonly listTenantGrowthOperationalCasesUseCase: ListTenantGrowthOperationalCasesUseCase,
    private readonly getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase: GetTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
  ): Promise<TenantGrowthAssistDailyAgendaView> {
    const [workbench, outboundSummary, operationalCases, autoAssignmentSettings] =
      await Promise.all([
        this.getTenantGrowthConversationWorkbenchUseCase.execute(tenantSlug),
        this.getTenantWhatsappOutboundReportingSummaryUseCase.execute(tenantSlug),
        this.listTenantGrowthOperationalCasesUseCase.execute(tenantSlug),
        this.getTenantGrowthOperationalCaseAutoAssignmentSettingsUseCase.execute(
          tenantSlug,
        ),
      ]);

    const openCases = operationalCases.filter((entry) => entry.status !== 'resolved');
    const summarySignals = this.buildSummarySignals(
      workbench,
      openCases,
      outboundSummary,
      autoAssignmentSettings.defaultPolicyKey,
    );

    const tasks = this.buildTasks(workbench, openCases);

    return {
      tenantSlug,
      generatedAt: this.nowProvider(),
      summary: summarySignals,
      tasks,
      conversationCues: this.buildConversationCues(workbench),
      replySuggestions: this.buildReplySuggestions(workbench),
      nextActions: this.buildNextActions(summarySignals, tasks, outboundSummary),
      playbooks: this.buildPlaybooks(
        summarySignals,
        autoAssignmentSettings.defaultPolicyKey,
      ),
      waitingCustomerQueue: this.buildWaitingCustomerQueue(openCases),
      channelHealth: {
        overallStatus: outboundSummary.operationalDashboard.overallStatus,
        totalAlertCount: outboundSummary.operationalAlerts.length,
        readyRetryCount: outboundSummary.retryOperations.readyNowCount,
        topAlertTitle: outboundSummary.operationalAlerts[0]?.title ?? null,
        topAlertSummary: outboundSummary.operationalAlerts[0]?.summary ?? null,
        topAlertRecommendedAction:
          outboundSummary.operationalAlerts[0]?.recommendedAction ?? null,
      },
    };
  }

  private buildSummarySignals(
    workbench: TenantGrowthConversationWorkbenchView,
    openCases: GrowthOperationalCaseRecord[],
    outboundSummary: TenantWhatsappOutboundReportingSummaryView,
    savedPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first',
  ): TenantGrowthAssistDailyAgendaView['summary'] {
    const replyNowCount = workbench.summary.overdueFirstResponseCount;
    const followUpNowCount =
      workbench.summary.overdueFollowUpCount +
      openCases.filter((entry) => entry.routingPolicyKey === 'follow_up_team')
        .length;
    const waitingCustomerCount = openCases.filter(
      (entry) =>
        entry.routingPolicyKey === 'follow_up_waiting_customer' ||
        entry.followUpState === 'waiting_customer',
    ).length;
    const queueToOrganizeCount =
      workbench.summary.unassignedThreadCount +
      openCases.filter(
        (entry) =>
          entry.routingPolicyKey === 'owner_assignment' ||
          entry.routingPolicyKey === 'escalation_review',
      ).length;
    const channelRiskCount = outboundSummary.operationalAlerts.length;

    if (replyNowCount > 0) {
      return {
        tone: 'critical',
        headline: 'Hoy ya hay conversaciones que necesitan respuesta inmediata.',
        detail:
          'Empieza por las conversaciones sin primera respuesta o con seguimiento vencido antes de abrir campañas nuevas.',
        replyNowCount,
        followUpNowCount,
        waitingCustomerCount,
        queueToOrganizeCount,
        channelRiskCount,
        savedPolicyKey,
      };
    }

    if (followUpNowCount > 0) {
      return {
        tone: 'warning',
        headline:
          'La bandeja no esta rota, pero si hay seguimientos que no conviene dejar enfriar.',
        detail:
          'Usa esta agenda como recordatorio simple: primero sigue lo que ya esta caliente, luego reparte owner nuevo si hace falta.',
        replyNowCount,
        followUpNowCount,
        waitingCustomerCount,
        queueToOrganizeCount,
        channelRiskCount,
        savedPolicyKey,
      };
    }

    if (outboundSummary.operationalDashboard.overallStatus === 'critical') {
      return {
        tone: 'critical',
        headline:
          'La conversacion comercial esta ordenada, pero el canal necesita atencion.',
        detail:
          'Antes de empujar mas trafico, revisa el estado del canal y los bloqueos operativos que puedan afectar entregas o retries.',
        replyNowCount,
        followUpNowCount,
        waitingCustomerCount,
        queueToOrganizeCount,
        channelRiskCount,
        savedPolicyKey,
      };
    }

    if (outboundSummary.operationalDashboard.overallStatus === 'warning') {
      return {
        tone: 'warning',
        headline:
          'La agenda esta controlada, aunque el canal ya muestra desgaste ligero.',
        detail:
          'Es buen momento para ordenar la cola y mirar alertas antes de que se conviertan en un problema mayor.',
        replyNowCount,
        followUpNowCount,
        waitingCustomerCount,
        queueToOrganizeCount,
        channelRiskCount,
        savedPolicyKey,
      };
    }

    return {
      tone: 'healthy',
      headline:
        'La operacion esta bajo control; puedes usar Growth como agenda diaria y radar temprano.',
      detail:
        'No hay urgencias fuertes ahora mismo. Aprovecha para mantener seguimiento consistente y revisar leads calientes antes de que se enfrien.',
      replyNowCount,
      followUpNowCount,
      waitingCustomerCount,
      queueToOrganizeCount,
      channelRiskCount,
      savedPolicyKey,
    };
  }

  private buildTasks(
    workbench: TenantGrowthConversationWorkbenchView,
    openCases: GrowthOperationalCaseRecord[],
  ): TenantGrowthAssistTaskView[] {
    const tasks: TenantGrowthAssistTaskView[] = [];

    for (const thread of workbench.threads) {
      if (
        thread.firstResponseStatus === 'overdue' &&
        thread.nextActionOwner === 'team'
      ) {
        tasks.push({
          key: `reply:${thread.threadId}`,
          urgency: 'today',
          category: 'reply_now',
          title: `Responder a ${thread.subject}`,
          summary: `${this.channelLabel(thread.channel)} lleva ${this.formatRelativeHours(
            thread.hoursSinceLastInbound ?? thread.hoursSinceOpened,
          )} esperando una respuesta del equipo.`,
          actionLabel: thread.assigneeUserId ? 'Responder ahora' : 'Asignar y responder',
          dueAt: thread.lastInboundAt,
          threadId: thread.threadId,
          operationalCaseId: null,
        });
      } else if (
        thread.followUpStatus === 'overdue' &&
        thread.nextActionOwner === 'team'
      ) {
        tasks.push({
          key: `follow-thread:${thread.threadId}`,
          urgency: 'soon',
          category: 'follow_up',
          title: `Retomar ${thread.subject}`,
          summary: `El siguiente paso del equipo ya quedo atrasado y la conversacion lleva ${this.formatRelativeHours(
            thread.hoursSinceLastActivity,
          )} sin movimiento.`,
          actionLabel: 'Hacer follow-up',
          dueAt: thread.lastActivityAt,
          threadId: thread.threadId,
          operationalCaseId: null,
        });
      }
    }

    for (const entry of openCases) {
      if (entry.routingPolicyKey === 'owner_assignment') {
        tasks.push({
          key: `case-owner:${entry.id}`,
          urgency: entry.priority === 'critical' ? 'today' : 'soon',
          category: 'assign_owner',
          title: `Definir responsable: ${entry.title}`,
          summary:
            entry.assignedUserEmail === null
              ? 'Nadie lleva este caso todavia; conviene ordenarlo antes de perder contexto.'
              : entry.nextAction,
          actionLabel: 'Auto-organizar cola',
          dueAt: entry.dueAt,
          threadId: entry.threadId,
          operationalCaseId: entry.id,
        });
      } else if (entry.routingPolicyKey === 'follow_up_team') {
        tasks.push({
          key: `case-follow-up:${entry.id}`,
          urgency: entry.priority === 'critical' ? 'today' : 'soon',
          category: 'follow_up',
          title: `No dejar enfriar: ${entry.title}`,
          summary: entry.nextAction,
          actionLabel: 'Mover seguimiento',
          dueAt: entry.dueAt,
          threadId: entry.threadId,
          operationalCaseId: entry.id,
        });
      } else if (
        entry.routingPolicyKey === 'escalation_review' ||
        entry.caseType === 'alert_escalation'
      ) {
        tasks.push({
          key: `case-risk:${entry.id}`,
          urgency: 'today',
          category: 'channel_risk',
          title: `Revisar bloqueo: ${entry.title}`,
          summary:
            entry.summary ||
            'Este caso ya escalo y conviene revisarlo antes de seguir empujando trafico.',
          actionLabel: 'Revisar routing',
          dueAt: entry.dueAt,
          threadId: entry.threadId,
          operationalCaseId: entry.id,
        });
      }
    }

    const urgencyWeight = { today: 3, soon: 2, watch: 1 } as const;

    return tasks
      .sort(
        (left, right) =>
          urgencyWeight[right.urgency] - urgencyWeight[left.urgency] ||
          (left.dueAt?.toISOString() ?? '').localeCompare(
            right.dueAt?.toISOString() ?? '',
          ) ||
          left.title.localeCompare(right.title),
      )
      .slice(0, 6);
  }

  private buildConversationCues(
    workbench: TenantGrowthConversationWorkbenchView,
  ): TenantGrowthAssistConversationCueView[] {
    return workbench.threads
      .filter(
        (thread) =>
          thread.nextActionOwner === 'team' &&
          (thread.firstResponseStatus === 'overdue' ||
            thread.followUpStatus === 'overdue' ||
            thread.priority === 'critical' ||
            thread.priority === 'high'),
      )
      .map((thread) => {
        const warmth: TenantGrowthAssistConversationCueView['warmth'] =
          thread.firstResponseStatus === 'overdue' || thread.priority === 'critical'
            ? 'hot'
            : thread.followUpStatus === 'overdue' || thread.priority === 'high'
              ? 'warm'
              : 'watch';

        return {
          key: thread.threadId,
          warmth,
          title: thread.subject,
          summary: `${this.channelLabel(thread.channel)} · ultima actividad hace ${this.formatRelativeHours(
            thread.hoursSinceLastActivity,
          )} · ${thread.latestMessagePreview ?? 'Sin preview reciente.'}`,
          suggestedReply:
            thread.firstResponseStatus === 'overdue'
              ? `Hola ${thread.subject}, gracias por escribirnos. Quiero retomar esto hoy mismo y dejarte el siguiente paso claro.`
              : thread.followUpStatus === 'overdue'
                ? `Hola ${thread.subject}, retomo esta conversacion para no dejarla enfriar. Si te parece, hoy cerramos el siguiente paso.`
                : `Hola ${thread.subject}, te escribo para mantener el avance y confirmar si seguimos con el siguiente paso.`,
          nextMove:
            thread.assigneeUserId === null
              ? 'Primero deja owner claro y luego responde.'
              : thread.firstResponseStatus === 'overdue'
                ? 'Responde hoy y deja siguiente accion acordada.'
                : 'Haz follow-up y deja la fecha del siguiente toque.',
          threadId: thread.threadId,
        };
      })
      .slice(0, 4);
  }

  private buildPlaybooks(
    summary: TenantGrowthAssistDailyAgendaView['summary'],
    savedPolicyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first',
  ): TenantGrowthAssistPlaybookView[] {
    const playbooks: TenantGrowthAssistPlaybookView[] = [];

    if (summary.replyNowCount > 0) {
      playbooks.push({
        key: 'reply-now',
        title: 'Responder primero',
        detail:
          'Antes de abrir nueva prospeccion, responde lo que ya llego caliente. Esa es la forma mas simple de no perder conversion por demora.',
        whenToUse: 'Cuando hay conversaciones sin primera respuesta o follow-up vencido.',
        steps: [
          'Agradece el contacto y retoma el contexto en una frase simple.',
          'Propone un siguiente paso concreto para hoy.',
          'Cierra con una pregunta que facilite una respuesta corta.',
        ],
      });
    }

    if (summary.queueToOrganizeCount > 0) {
      playbooks.push({
        key: 'queue-organize',
        title: 'Ordenar responsables',
        detail: `El negocio ya puede repartir trabajo con el criterio guardado: ${this.describePolicy(
          savedPolicyKey,
        )}.`,
        whenToUse: 'Cuando ves conversaciones o casos sin owner claro.',
        steps: [
          'Auto-organiza la cola con el pack guardado.',
          'Revisa si quedo algun caso critico sin owner.',
          'Deja claro quien responde y quien da seguimiento.',
        ],
      });
    }

    if (summary.channelRiskCount > 0) {
      playbooks.push({
        key: 'channel-risk',
        title: 'Cuidar la salud del canal',
        detail:
          'Si el canal esta inestable, mas mensajes no siempre ayudan. Revisa alertas y retries antes de empujar volumen nuevo.',
        whenToUse: 'Cuando el monitor muestra alertas o retries listos.',
        steps: [
          'Actualiza la salud del canal antes de lanzar mas actividad.',
          'Revisa bloqueos, retries y alertas dominantes.',
          'Retoma el volumen solo cuando el canal vuelva a estar estable.',
        ],
      });
    }

    if (summary.waitingCustomerCount > 0) {
      playbooks.push({
        key: 'waiting-customer',
        title: 'Vigilar respuestas pendientes',
        detail:
          'No todo requiere accionar hoy; tambien conviene tener a mano lo que ya esta esperando cliente para retomar en el momento justo.',
        whenToUse: 'Cuando la cola tiene seguimientos esperando respuesta del cliente.',
        steps: [
          'Agrupa los casos que estan esperando al cliente.',
          'Marca una fecha clara para retomar si no responden.',
          'Evita empujar de mas cuando el siguiente turno depende del cliente.',
        ],
      });
    }

    if (playbooks.length === 0) {
      playbooks.push({
        key: 'healthy-routine',
        title: 'Mantener ritmo comercial',
        detail:
          'Sin urgencias visibles, Growth ya funciona como agenda simple: revisa leads nuevos, confirma seguimientos de hoy y deja claro el siguiente paso de cada conversacion.',
        whenToUse: 'Cuando no hay urgencias y el canal esta sano.',
        steps: [
          'Revisa si entraron leads nuevos o conversaciones tibias.',
          'Deja proximo paso claro en cada conversacion activa.',
          'Usa la agenda como radar temprano para que nada se enfrie.',
        ],
      });
    }

    return playbooks.slice(0, 4);
  }

  private buildReplySuggestions(
    workbench: TenantGrowthConversationWorkbenchView,
  ): TenantGrowthAssistReplySuggestionView[] {
    return workbench.threads
      .filter(
        (thread) =>
          thread.nextActionOwner === 'team' &&
          (thread.firstResponseStatus === 'overdue' ||
            thread.followUpStatus === 'overdue' ||
            thread.priority === 'critical' ||
            thread.priority === 'high'),
      )
      .map((thread) => {
        const warmth: TenantGrowthAssistReplySuggestionView['warmth'] =
          thread.firstResponseStatus === 'overdue' || thread.priority === 'critical'
            ? 'hot'
            : thread.followUpStatus === 'overdue' || thread.priority === 'high'
              ? 'warm'
              : 'watch';

        const reason =
          thread.firstResponseStatus === 'overdue'
            ? `La conversacion sigue sin primera respuesta despues de ${this.formatRelativeHours(
                thread.hoursSinceLastInbound ?? thread.hoursSinceOpened,
              )}.`
            : thread.followUpStatus === 'overdue'
              ? `El follow-up del equipo ya se paso y la conversacion lleva ${this.formatRelativeHours(
                  thread.hoursSinceLastActivity,
                )} sin moverse.`
              : `La conversacion sigue priorizada y conviene mantenerla en movimiento hoy.`;

        const goal =
          thread.firstResponseStatus === 'overdue'
            ? 'Reconocer el contacto, retomar confianza y proponer el siguiente paso.'
            : thread.followUpStatus === 'overdue'
              ? 'Reactivar la conversacion sin sonar invasivo y dejar un siguiente paso claro.'
              : 'Confirmar interes real y dejar acordado el proximo movimiento.';

        const suggestedReply =
          thread.firstResponseStatus === 'overdue'
            ? `Hola ${thread.subject}, gracias por escribirnos. Retomo esto hoy para ayudarte sin dejarlo enfriar. Si te parece, te comparto el siguiente paso y lo dejamos encaminado ahora mismo.`
            : thread.followUpStatus === 'overdue'
              ? `Hola ${thread.subject}, retomo esta conversacion para no dejarla enfriar. Quiero confirmar si seguimos con el siguiente paso y ayudarte a cerrarlo hoy de la forma mas simple posible.`
              : `Hola ${thread.subject}, te escribo para retomar el avance y confirmar si seguimos con el siguiente paso. Si te sirve, hoy mismo lo dejamos encaminado.`;

        const checklist = [
          thread.assigneeUserId === null
            ? 'Deja un owner claro antes de cerrar el siguiente paso.'
            : 'Mantén la respuesta desde el owner actual para conservar contexto.',
          thread.firstResponseStatus === 'overdue'
            ? 'Agradece el contacto y reconoce la espera si aplica.'
            : 'Retoma el hilo con una frase corta que recuerde el contexto.',
          'Propón un siguiente paso concreto en lugar de una pregunta abierta genérica.',
          'Cierra con una pregunta simple que facilite responder rápido.',
        ];

        return {
          key: `reply-suggestion:${thread.threadId}`,
          warmth,
          title: thread.subject,
          reason,
          goal,
          suggestedReply,
          followUpPrompt:
            thread.firstResponseStatus === 'overdue'
              ? 'Pregunta si prefiere demo, cotizacion o una respuesta puntual para destrabar la conversacion.'
              : 'Pregunta si le hace sentido seguir hoy o que dia conviene retomar.',
          checklist,
          threadId: thread.threadId,
        };
      })
      .slice(0, 4);
  }

  private buildNextActions(
    summary: TenantGrowthAssistDailyAgendaView['summary'],
    tasks: TenantGrowthAssistTaskView[],
    outboundSummary: TenantWhatsappOutboundReportingSummaryView,
  ): TenantGrowthAssistNextActionView[] {
    const nextActions = tasks.slice(0, 3).map(
      (task) =>
        ({
          key: `next-action:${task.key}`,
          emphasis:
            task.urgency === 'today'
              ? 'do_now'
              : task.category === 'channel_risk'
                ? 'stabilize'
                : 'today',
          actionType: task.category,
          title: task.title,
          whyNow: task.summary,
          recommendedAction: this.describeRecommendedAction(task),
          businessImpact: this.describeBusinessImpact(task),
          threadId: task.threadId,
          operationalCaseId: task.operationalCaseId,
        }) satisfies TenantGrowthAssistNextActionView,
    );

    if (
      nextActions.length < 3 &&
      outboundSummary.operationalDashboard.overallStatus !== 'healthy'
    ) {
      nextActions.push({
        key: 'next-action:channel-health',
        emphasis:
          outboundSummary.operationalDashboard.overallStatus === 'critical'
            ? 'stabilize'
            : 'today',
        actionType: 'channel_risk',
        title: 'Revisar salud del canal antes de empujar mas actividad',
        whyNow:
          outboundSummary.operationalAlerts[0]?.summary ??
          'El canal ya muestra señales que conviene ordenar antes de seguir empujando mensajes.',
        recommendedAction:
          outboundSummary.operationalAlerts[0]?.recommendedAction ??
          'Actualiza el monitor, revisa alertas y confirma si hay retries o bloqueos activos.',
        businessImpact:
          'Si el canal esta inestable, puedes perder timing comercial aunque la cola este ordenada.',
        threadId: null,
        operationalCaseId: null,
      });
    }

    if (nextActions.length === 0) {
      nextActions.push({
        key: 'next-action:healthy-routine',
        emphasis: 'today',
        actionType: 'follow_up',
        title: 'Mantener ritmo comercial sin sobre-operar',
        whyNow: summary.detail,
        recommendedAction:
          'Revisa leads tibios, confirma proximo paso en conversaciones activas y evita abrir complejidad nueva si no hace falta.',
        businessImpact:
          'La constancia suele mover mas negocio que reaccionar tarde solo cuando algo ya esta vencido.',
        threadId: null,
        operationalCaseId: null,
      });
    }

    return nextActions.slice(0, 3);
  }

  private buildWaitingCustomerQueue(
    openCases: GrowthOperationalCaseRecord[],
  ): TenantGrowthAssistWaitingCustomerView[] {
    return openCases
      .filter(
        (entry) =>
          entry.routingPolicyKey === 'follow_up_waiting_customer' ||
          entry.followUpState === 'waiting_customer',
      )
      .sort(
        (left, right) =>
          (left.dueAt?.toISOString() ?? '').localeCompare(
            right.dueAt?.toISOString() ?? '',
          ) || right.updatedAt.getTime() - left.updatedAt.getTime(),
      )
      .slice(0, 4)
      .map((entry) => ({
        caseId: entry.id,
        title: entry.title,
        summary: entry.summary,
        nextAction: entry.nextAction,
        assignedUserEmail: entry.assignedUserEmail,
        dueAt: entry.dueAt,
      }));
  }

  private describePolicy(
    policyKey: 'balanced' | 'owner_queue_first' | 'follow_up_first',
  ): string {
    switch (policyKey) {
      case 'follow_up_first':
        return 'empezar por seguimientos antes de repartir nueva cola';
      case 'owner_queue_first':
        return 'vaciar primero trabajo sin owner claro';
      case 'balanced':
      default:
        return 'repartir de forma equilibrada entre urgencias, owners y follow-up';
    }
  }

  private describeRecommendedAction(task: TenantGrowthAssistTaskView): string {
    switch (task.category) {
      case 'reply_now':
        return 'Responder hoy mismo y cerrar con un siguiente paso concreto.';
      case 'follow_up':
        return 'Retomar el hilo con contexto corto y acordar fecha o siguiente movimiento.';
      case 'assign_owner':
        return 'Dejar owner claro antes de que el caso pierda contexto o prioridad.';
      case 'channel_risk':
        return 'Mirar monitor, alertas y retries antes de empujar mas trafico.';
      default:
        return task.actionLabel;
    }
  }

  private describeBusinessImpact(task: TenantGrowthAssistTaskView): string {
    switch (task.category) {
      case 'reply_now':
        return 'Responder tarde enfria conversaciones que ya llegaron con intencion activa.';
      case 'follow_up':
        return 'Un follow-up a tiempo mantiene movimiento sin obligarte a reabrir contexto mas tarde.';
      case 'assign_owner':
        return 'Sin owner claro, el trabajo parece existir pero nadie lo termina de mover.';
      case 'channel_risk':
        return 'Un canal inestable puede romper entregas y arruinar timing comercial aunque el equipo responda bien.';
      default:
        return 'Mover esto hoy ayuda a sostener ritmo comercial y claridad operativa.';
    }
  }

  private channelLabel(channel: string): string {
    switch (channel) {
      case 'whatsapp':
        return 'WhatsApp';
      case 'manual':
        return 'Manual';
      default:
        return channel;
    }
  }

  private formatRelativeHours(value: number | null): string {
    if (value === null) {
      return 'sin referencia reciente';
    }

    if (value < 1) {
      return 'menos de 1 hora';
    }

    const rounded = value < 24 ? Math.round(value) : Math.round(value / 24);

    if (value < 24) {
      return `${rounded} hora${rounded === 1 ? '' : 's'}`;
    }

    return `${rounded} dia${rounded === 1 ? '' : 's'}`;
  }
}
