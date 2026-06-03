import { TenantEcommerceLiveRunExecutionSummaryView } from '@saas-platform/ecommerce-domain';
import { GetTenantEcommerceOrderOpsEscalationBoardUseCase } from './get-tenant-ecommerce-order-ops-escalation-board.use-case';
import { GetTenantEcommerceOrderPostSaleReportingSummaryUseCase } from './get-tenant-ecommerce-order-post-sale-reporting-summary.use-case';
import { RequestTenantEcommerceLiveRunReadinessPacketUseCase } from './request-tenant-ecommerce-live-run-readiness-packet.use-case';

export class RequestTenantEcommerceLiveRunExecutionSummaryUseCase {
  constructor(
    private readonly requestTenantEcommerceLiveRunReadinessPacketUseCase: RequestTenantEcommerceLiveRunReadinessPacketUseCase,
    private readonly getTenantEcommerceOrderOpsEscalationBoardUseCase: GetTenantEcommerceOrderOpsEscalationBoardUseCase,
    private readonly getTenantEcommerceOrderPostSaleReportingSummaryUseCase: GetTenantEcommerceOrderPostSaleReportingSummaryUseCase,
    private readonly nowProvider: () => Date = () => new Date(),
  ) {}

  async execute(
    tenantSlug: string,
    productEntityId: string,
  ): Promise<TenantEcommerceLiveRunExecutionSummaryView | null> {
    const [readinessPacket, escalationBoard, reportingSummary] =
      await Promise.all([
        this.requestTenantEcommerceLiveRunReadinessPacketUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceOrderOpsEscalationBoardUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
        this.getTenantEcommerceOrderPostSaleReportingSummaryUseCase.execute(
          tenantSlug,
          productEntityId,
        ),
      ]);

    if (!readinessPacket || !escalationBoard || !reportingSummary) {
      return null;
    }

    const executionStatus =
      readinessPacket.readinessStatus === 'blocked' ||
      escalationBoard.summary.criticalCount > 0 ||
      reportingSummary.summary.blockedCount > 0
        ? 'live_run_blocked'
        : readinessPacket.readinessStatus === 'needs_operator_closeout' ||
            escalationBoard.summary.elevatedCount > 0 ||
            reportingSummary.summary.divergenceCount > 0
          ? 'live_run_needs_closeout'
          : 'live_run_ready';
    const openReadinessSignals = readinessPacket.readinessSignals.filter(
      (signal) => signal.status !== 'ready',
    ).length;
    const riskRegister = [
      ...readinessPacket.blockedBy,
      ...(escalationBoard.summary.criticalCount > 0
        ? [`${escalationBoard.summary.criticalCount} escalaciones critical abiertas.`]
        : []),
      ...(escalationBoard.summary.elevatedCount > 0
        ? [`${escalationBoard.summary.elevatedCount} escalaciones elevated requieren seguimiento.`]
        : []),
      ...(reportingSummary.summary.divergenceCount > 0
        ? [`${reportingSummary.summary.divergenceCount} divergencias post-sale abiertas.`]
        : []),
      ...(reportingSummary.summary.blockedCount > 0
        ? [`${reportingSummary.summary.blockedCount} órdenes post-sale bloqueadas.`]
        : []),
    ];

    return {
      tenantSlug,
      productEntityId,
      generatedAt: this.nowProvider(),
      productEntity: readinessPacket.productEntity,
      executionStatus,
      summary:
        executionStatus === 'live_run_ready'
          ? 'El live run está listo para ejecutarse con señales operativas y post-sale estables.'
          : executionStatus === 'live_run_needs_closeout'
            ? 'El live run requiere closeout operativo antes de avanzar sin supervisión.'
            : 'El live run está bloqueado hasta resolver riesgos críticos.',
      readinessSnapshot: {
        readinessStatus: readinessPacket.readinessStatus,
        openReadinessSignals,
        blockedBy: [...readinessPacket.blockedBy],
      },
      operationsSnapshot: {
        totalEscalations: escalationBoard.summary.totalEscalations,
        criticalCount: escalationBoard.summary.criticalCount,
        elevatedCount: escalationBoard.summary.elevatedCount,
        monitorCount: escalationBoard.summary.monitorCount,
      },
      reportingSnapshot: {
        totalOrders: reportingSummary.summary.totalOrders,
        confirmedCount: reportingSummary.summary.confirmedCount,
        deliveredCount: reportingSummary.summary.deliveredCount,
        blockedCount: reportingSummary.summary.blockedCount,
        disputedCount: reportingSummary.summary.disputedCount,
        divergenceCount: reportingSummary.summary.divergenceCount,
      },
      launchActions: this.buildLaunchActions(executionStatus),
      riskRegister,
      nextStep:
        executionStatus === 'live_run_ready'
          ? 'Ejecutar live run controlado y monitorear dashboard de completion.'
          : executionStatus === 'live_run_needs_closeout'
            ? 'Cerrar elevated/divergencias y volver a solicitar execution summary.'
            : 'Resolver bloqueos críticos antes de intentar live run.',
      guardrails: [
        ...readinessPacket.guardrails,
        'Este summary no publica storefront ni ejecuta cobros; sólo consolida readiness operativo.',
      ],
    };
  }

  private buildLaunchActions(
    executionStatus: TenantEcommerceLiveRunExecutionSummaryView['executionStatus'],
  ): string[] {
    return executionStatus === 'live_run_ready'
      ? [
          'Confirmar ventana de live run.',
          'Monitorear completion dashboard y post-sale reporting durante la ejecución.',
        ]
      : executionStatus === 'live_run_needs_closeout'
        ? [
            'Resolver señales elevated o divergencias post-sale.',
            'Actualizar readiness packet después del closeout.',
          ]
        : [
            'Resolver escalaciones critical o bloqueos post-sale.',
            'No ejecutar live run hasta limpiar el risk register.',
          ];
  }
}
