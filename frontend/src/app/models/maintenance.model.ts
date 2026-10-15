export enum MaintenanceType {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export interface Maintenance {
  id: number;
  performedAt: string;
  type: MaintenanceType;
  hitsAtMaintenance: number;
  notes: string | null;
  die: { id: number; dieNumber: string };
}

export interface CreateMaintenancePayload {
  performedAt: string;
  type: MaintenanceType;
  hitsAtMaintenance: number;
  notes: string;
  dieId: number;
}

export interface UpdateMaintenancePayload {
  performedAt?: string;
  type?: MaintenanceType;
  hitsAtMaintenance?: number;
  notes?: string;
}

export function getMaintenanceTypeLabel(type: MaintenanceType): string {
  switch (type) {
    case MaintenanceType.LOW:
      return 'Baja';
    case MaintenanceType.MEDIUM:
      return 'Media';
    case MaintenanceType.HIGH:
      return 'Alta';
  }
}

export function getMaintenancePriority(percentage: number): MaintenanceType | null {
  if (percentage >= 110) return MaintenanceType.HIGH;
  if (percentage >= 100) return MaintenanceType.MEDIUM;
  if (percentage >= 90) return MaintenanceType.LOW;
  return null;
}
