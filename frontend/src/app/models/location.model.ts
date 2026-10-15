export enum LocationType {
  STORAGE = 'storage',
  PRESS_POSITION = 'pressPosition',
}

export interface Location {
  id: number;
  type: LocationType;
  name: string;
}

export interface CreateLocationPayload {
  type: LocationType;
  name: string;
}

export interface UpdateLocationPayload {
  type?: LocationType;
  name?: string;
}

export function getLocationTypeLabel(type: LocationType): string {
  switch (type) {
    case LocationType.STORAGE:
      return 'Almacén';
    case LocationType.PRESS_POSITION:
      return 'Posición de prensa';
  }
}
