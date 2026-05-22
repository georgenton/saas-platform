import { GetTenantGrowthAssistAiSuggestionEnvelopeUseCase } from '@saas-platform/ai-application';

describe('AI suggestion envelope use case', () => {
  const getTenantGrowthAssistDailyAgendaUseCase = {
    execute: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
    getTenantGrowthAssistDailyAgendaUseCase.execute.mockResolvedValue({
      tenantSlug: 'saas-platform',
      generatedAt: new Date('2026-05-22T11:00:00.000Z'),
      summary: {
        tone: 'warning',
        headline: 'Hoy hay una bandeja que conviene mover.',
        detail: 'Empieza por las respuestas calientes y luego ordena owners.',
        replyNowCount: 1,
        followUpNowCount: 2,
        waitingCustomerCount: 1,
        queueToOrganizeCount: 1,
        channelRiskCount: 0,
        savedPolicyKey: 'follow_up_first',
      },
      leadWarmthSummary: {
        hotCount: 1,
        warmCount: 1,
        watchCount: 0,
        dominantWarmth: 'hot',
        recommendedFocus: 'Prioriza lo que ya esta mas cerca de conversar hoy.',
      },
      tasks: [],
      conversationCues: [],
      replySuggestions: [
        {
          key: 'reply-suggestion:thread_001',
          warmth: 'hot',
          title: 'WhatsApp Maria Perez',
          reason: 'Lleva dos horas esperando respuesta.',
          goal: 'Retomar la conversacion y cerrar un siguiente paso.',
          suggestedReply: 'Hola Maria, retomo esto hoy para ayudarte.',
          followUpPrompt: 'Pregunta si prefiere demo o cotizacion.',
          checklist: ['Agradece el contacto'],
          threadId: 'thread_001',
        },
      ],
      nextActions: [
        {
          key: 'next-action:reply:thread_001',
          emphasis: 'do_now',
          actionType: 'reply_now',
          title: 'Responder a WhatsApp Maria Perez',
          whyNow: 'La conversacion ya esta caliente.',
          recommendedAction: 'Responder hoy mismo.',
          businessImpact: 'Evita perder una intencion activa.',
          threadId: 'thread_001',
          operationalCaseId: null,
        },
      ],
      leadWarmthHints: [
        {
          key: 'warmth:thread_001',
          warmth: 'hot',
          title: 'WhatsApp Maria Perez',
          signalSummary: 'Pidio una demo hace dos horas.',
          whyWarmth: 'Ya llego con intencion concreta.',
          recommendedCadence: 'Muévelo hoy mismo.',
          riskNote: 'La intencion puede enfriarse rapido.',
          threadId: 'thread_001',
        },
      ],
      playbooks: [
        {
          key: 'reply-now',
          title: 'Responder primero',
          detail: 'Responde antes de abrir prospeccion nueva.',
          goal: 'Mover la conversacion sin perder el contexto.',
          avoid: 'No contestes con texto generico.',
          successSignal: 'El lead acepta el siguiente paso.',
          whenToUse: 'Cuando la conversacion ya pide movimiento.',
          steps: ['Reconoce el contexto', 'Propone siguiente paso'],
        },
      ],
      waitingCustomerQueue: [],
      channelHealth: {
        overallStatus: 'healthy',
        totalAlertCount: 0,
        readyRetryCount: 0,
        topAlertTitle: null,
        topAlertSummary: null,
        topAlertRecommendedAction: null,
      },
    });
  });

  it('builds a tenant-scoped suggestion envelope from the deterministic Growth Assist agenda', async () => {
    const useCase = new GetTenantGrowthAssistAiSuggestionEnvelopeUseCase(
      getTenantGrowthAssistDailyAgendaUseCase as any,
    );

    const result = await useCase.execute('saas-platform');

    expect(result.generatedAt).toEqual(new Date('2026-05-22T11:00:00.000Z'));
    expect(result.agent).toEqual(
      expect.objectContaining({
        key: 'growth-assist-coach',
        availability: 'ready',
        defaultMode: 'suggestion',
      }),
    );
    expect(result.promptPack).toEqual(
      expect.objectContaining({
        key: 'growth-assist-coach-core',
        version: 'v1',
        agentKey: 'growth-assist-coach',
        title: 'Growth Assist Coach Core',
      }),
    );
    expect(result.surface).toEqual(
      expect.objectContaining({
        key: 'growth_assist_daily_agenda',
        sourceContractKey: 'growth.assist.daily_agenda',
        sourceGeneratedAt: new Date('2026-05-22T11:00:00.000Z'),
      }),
    );
    expect(result.promptPack.suggestedOutputs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'reply_draft' }),
        expect.objectContaining({ key: 'next_action_brief' }),
      ]),
    );
    expect(result.contextBlocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: 'agenda_summary',
          bullets: expect.arrayContaining([
            'Reply now count: 1',
            'Saved auto-assignment policy: follow_up_first',
          ]),
        }),
        expect.objectContaining({
          key: 'reply_suggestions',
          bullets: expect.arrayContaining([
            expect.stringContaining('goal=Retomar la conversacion y cerrar un siguiente paso.'),
          ]),
        }),
      ]),
    );
  });
});
