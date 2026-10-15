import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DieService } from '../data/die.service';
import { LocationService } from '../data/location.service';
import { Die } from '../models/die.model';
import { Location, LocationType, getLocationTypeLabel } from '../models/location.model';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-locations',
  imports: [ReactiveFormsModule],
  templateUrl: './locations.html',
  styleUrl: './locations.css',
})
export class Locations {
  private locationService = inject(LocationService);
  private dieService = inject(DieService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  locations = signal<Location[]>([]);
  dies = signal<Die[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  saving = signal(false);

  addingNew = signal(false);
  editingId = signal<number | null>(null);

  typeOptions = [
    { value: LocationType.STORAGE, label: getLocationTypeLabel(LocationType.STORAGE) },
    { value: LocationType.PRESS_POSITION, label: getLocationTypeLabel(LocationType.PRESS_POSITION) },
  ];

  getLocationTypeLabel = getLocationTypeLabel;

  form = this.fb.nonNullable.group({
    type: [LocationType.STORAGE, Validators.required],
    name: ['', Validators.required],
  });

  dieCountByLocation = computed(() => {
    const map = new Map<number, number>();
    for (const die of this.dies()) {
      if (die.location) {
        map.set(die.location.id, (map.get(die.location.id) ?? 0) + 1);
      }
    }
    return map;
  });

  constructor() {
    this.loadLocations();
    this.loadDies();
  }

  loadLocations(): void {
    this.loading.set(true);
    this.locationService.getAll().subscribe({
      next: (locations) => {
        this.locations.set(locations);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo conectar con el servidor.');
        this.loading.set(false);
      },
    });
  }

  loadDies(): void {
    this.dieService.getAll().subscribe({
      next: (dies) => this.dies.set(dies),
      error: () => this.dies.set([]),
    });
  }

  dieCount(locationId: number): number {
    return this.dieCountByLocation().get(locationId) ?? 0;
  }

  startAdd(): void {
    this.errorMsg.set(null);
    this.editingId.set(null);
    this.addingNew.set(true);
    this.form.reset({ type: LocationType.STORAGE, name: '' });
  }

  startEdit(location: Location): void {
    this.errorMsg.set(null);
    this.addingNew.set(false);
    this.editingId.set(location.id);
    this.form.reset({ type: location.type, name: location.name });
  }

  cancel(): void {
    this.addingNew.set(false);
    this.editingId.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = 'Falta el nombre de la ubicación.';
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.errorMsg.set(null);

    if (this.addingNew()) {
      this.locationService.create(value).subscribe({
        next: (created) => {
          this.locations.update((list) => [...list, created]);
          this.saving.set(false);
          this.addingNew.set(false);
          this.toast.success(`Ubicación "${created.name}" creada correctamente.`);
        },
        error: (err) => {
          this.saving.set(false);
          const message =
            err?.status === 409
              ? 'Ya existe una ubicación con ese nombre.'
              : 'No se pudo crear la ubicación. Intenta nuevamente.';
          this.errorMsg.set(message);
          this.toast.error(message);
        },
      });
      return;
    }

    const id = this.editingId();
    if (id === null) return;

    this.locationService.update(id, value).subscribe({
      next: (updated) => {
        this.locations.update((list) => list.map((l) => (l.id === id ? updated : l)));
        this.saving.set(false);
        this.editingId.set(null);
        this.toast.success(`Ubicación "${updated.name}" actualizada.`);
      },
      error: (err) => {
        this.saving.set(false);
        const message =
          err?.status === 409
            ? 'Ya existe una ubicación con ese nombre.'
            : 'No se pudo actualizar la ubicación. Intenta nuevamente.';
        this.errorMsg.set(message);
        this.toast.error(message);
      },
    });
  }

  remove(location: Location): void {
    this.errorMsg.set(null);
    const count = this.dieCount(location.id);

    if (count > 0) {
      const message = `No se puede eliminar "${location.name}": tiene ${count} dado${count === 1 ? '' : 's'} asignado${count === 1 ? '' : 's'}. Reasigna esos dados a otra ubicación antes de eliminarla.`;
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    if (!confirm(`¿Eliminar la ubicación "${location.name}"?`)) return;

    this.locationService.remove(location.id).subscribe({
      next: () => {
        this.locations.update((list) => list.filter((l) => l.id !== location.id));
        this.toast.success(`Ubicación "${location.name}" eliminada.`);
      },
      error: (err) => {
        const message =
          err?.status === 409
            ? `No se puede eliminar "${location.name}": todavía tiene dados asignados.`
            : 'No se pudo eliminar la ubicación.';
        this.errorMsg.set(message);
        this.toast.error(message);
      },
    });
  }
}
