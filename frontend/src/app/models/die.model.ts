import { Location } from './location.model';

export enum DieStatus {
  RUN = 'run',
  RUN_SOMETIMES = 'runSometimes',
  NOT_RUNNING = 'notRunning',
}

export interface Die {
  id: number;
  dieNumber: string;
  rotorNumber: string | null;
  statorNumber: string | null;
  status: DieStatus;
  location: Location | null;
  hits: number;
  hitsThreshold: number | null;
  notes: string | null;
}

export interface CreateDiePayload {
  dieNumber: string;
  rotorNumber?: string;
  statorNumber?: string;
  status: DieStatus;
  locationId?: number;
  hits: number;
  hitsThreshold?: number;
  notes?: string;
}

export interface UpdateDiePayload {
  dieNumber?: string;
  rotorNumber?: string;
  statorNumber?: string;
  status?: DieStatus;
  locationId?: number;
  hits?: number;
  hitsThreshold?: number | null;
  notes?: string | null;
}

export function getDieStatusLabel(status: DieStatus): string {
  switch (status) {
    case DieStatus.RUN:
      return 'Corriendo';
    case DieStatus.RUN_SOMETIMES:
      return 'A veces corre';
    case DieStatus.NOT_RUNNING:
      return 'No ha corrido';
  }
}
