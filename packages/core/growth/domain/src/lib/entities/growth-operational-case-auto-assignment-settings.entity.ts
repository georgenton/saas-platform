export type GrowthOperationalCaseAutoAssignmentPolicyKey =
  | 'balanced'
  | 'owner_queue_first'
  | 'follow_up_first';

export interface GrowthOperationalCaseAutoAssignmentSettingsProps {
  id: string;
  tenantId: string;
  defaultPolicyKey: GrowthOperationalCaseAutoAssignmentPolicyKey;
  createdAt: Date;
  updatedAt: Date;
}

export class GrowthOperationalCaseAutoAssignmentSettings {
  private constructor(
    private readonly props: GrowthOperationalCaseAutoAssignmentSettingsProps,
  ) {}

  static create(
    props: GrowthOperationalCaseAutoAssignmentSettingsProps,
  ): GrowthOperationalCaseAutoAssignmentSettings {
    return new GrowthOperationalCaseAutoAssignmentSettings(props);
  }

  get id(): string {
    return this.props.id;
  }

  get tenantId(): string {
    return this.props.tenantId;
  }

  get defaultPolicyKey(): GrowthOperationalCaseAutoAssignmentPolicyKey {
    return this.props.defaultPolicyKey;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  toPrimitives(): GrowthOperationalCaseAutoAssignmentSettingsProps {
    return { ...this.props };
  }
}
