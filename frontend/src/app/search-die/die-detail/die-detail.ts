import { Component, computed, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DieService } from '../../data/die.service';
import { Die, DieStatus, getDieStatusLabel } from '../../models/die.model';
import { Location } from '../../models/location.model';
import { LocationFormModal } from '../../locations/location-form-modal/location-form-modal';
import { ToastService } from '../../shared/toast/toast.service';
import { AuthService } from '../../data/auth.service';
import { UserRole } from '../../models/user.model';
import { ConfirmDialog } from '../../shared/confirm-dialog/confirm-dialog';
import type { UpdateDiePayload } from '../../models/die.model';

@Component({
  selector: 'app-die-detail',
  imports: [ReactiveFormsModule, RouterLink, LocationFormModal, ConfirmDialog],
  templateUrl: './die-detail.html',
  styleUrl: './die-detail.css',
})
export class DieDetail {
  die = input.required<Die>();
  locations = input<Location[]>([]);
  updated = output<Die>();
  locationCreated = output<Location>();

  private dieService = inject(DieService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  canEdit = computed(() => this.authService.user()?.role !== UserRole.MAINTENANCE);
  canEditFull = computed(() => this.authService.user()?.role === UserRole.ADMIN);

  editing = signal(false);
  saving = signal(false);
  errorMsg = signal<string | null>(null);
  showLocationModal = signal(false);  pendingChange = signal<{ hits: number; notes: string } | null>(null);

  private extraLocations = signal<Location[]>([]);

  availableLocations = computed(() => {
    const base = this.locations();
    const extra = this.extraLocations().filter((e) => !base.some((b) => b.id === e.id));
    return [...base, ...extra];
  });

  statusOptions = [
    { value: DieStatus.RUN, label: getDieStatusLabel(DieStatus.RUN) },
    { value: DieStatus.RUN_SOMETIMES, label: getDieStatusLabel(DieStatus.RUN_SOMETIMES) },
    { value: DieStatus.NOT_RUNNING, label: getDieStatusLabel(DieStatus.NOT_RUNNING) },
  ];

  form = this.fb.nonNullable.group({
    dieNumber: ['', Validators.required],
    rotorNumber: [''],
    statorNumber: [''],
    status: [DieStatus.RUN, Validators.required],
    locationId: this.fb.control<number | null>(null),
    hits: [0, [Validators.required, Validators.min(0)]],
    hitsThreshold: this.fb.control<number | null>(null),
    notes: [''],
  });

  constructor() {
    effect(() => {
      this.resetForm(this.die());
    });
  }

  getDieStatusLabel = getDieStatusLabel;

  private resetForm(die: Die): void {
    this.form.reset({
      dieNumber: die.dieNumber,
      rotorNumber: die.rotorNumber ?? '',
      statorNumber: die.statorNumber ?? '',
      status: die.status,
      locationId: die.location?.id ?? null,
      hits: die.hits,
      hitsThreshold: die.hitsThreshold,
      notes: die.notes ?? '',
    });

    const minHits = this.canEditFull() ? 0 : die.hits;
    this.form.controls.hits.setValidators([Validators.required, Validators.min(minHits)]);
    this.form.controls.hits.updateValueAndValidity();
  }

  startEdit(): void {
    this.errorMsg.set(null);
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.errorMsg.set(null);
    this.resetForm(this.die());
    this.editing.set(false);
  }

  openLocationModal(): void {
    this.showLocationModal.set(true);
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
  }

  onLocationCreated(location: Location): void {
    this.extraLocations.update((list) => [...list, location]);
    this.form.patchValue({ locationId: location.id });
    this.showLocationModal.set(false);
    this.locationCreated.emit(location);
  }

  private describeValidationError(): string {
    if (this.canEditFull() && this.form.controls.dieNumber.hasError('required')) {
      return 'Falta el número de dado.';
    }
    if (this.form.controls.hits.hasError('required')) {
      return 'Ingresa los golpes (hits).';
    }
    if (this.form.controls.hits.hasError('min')) {
      return this.canEditFull()
        ? 'Los golpes no pueden ser negativos.'
        : `No puedes registrar menos de ${this.die().hits} golpes, ese es el valor actual del dado.`;
    }
    return 'Revisa los datos del formulario, algo no es válido.';
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = this.describeValidationError();
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    const value = this.form.getRawValue();

    if (!this.canEditFull()) {
      this.pendingChange.set({ hits: value.hits, notes: value.notes });
      return;
    }

    this.performSave({
      dieNumber: value.dieNumber,
      rotorNumber: value.rotorNumber,
      statorNumber: value.statorNumber,
      status: value.status,
      locationId: value.locationId ?? undefined,
      hits: value.hits,
      hitsThreshold: value.hitsThreshold,
      notes: value.notes,
    });
  }

  confirmPendingChange(): void {
    const pending = this.pendingChange();
    if (!pending) return;
    this.pendingChange.set(null);
    this.performSave({ hits: pending.hits, notes: pending.notes });
  }

  cancelPendingChange(): void {
    this.pendingChange.set(null);
  }

  private performSave(payload: UpdateDiePayload): void {
    this.saving.set(true);
    this.errorMsg.set(null);

    this.dieService
      .update(this.die().id, payload)
      .subscribe({
        next: (updatedDie) => {
          this.saving.set(false);
          this.editing.set(false);
          this.toast.success(`Cambios guardados en el dado ${updatedDie.dieNumber}.`);
          this.updated.emit(updatedDie);
        },
        error: (err) => {
          this.saving.set(false);
          const message =
            err?.status === 403
              ? 'No se pudo guardar: ' + (err?.error?.message ?? 'no tienes permiso para este cambio.')
              : 'No se pudieron guardar los cambios. Intenta nuevamente.';
          this.errorMsg.set(message);
          this.toast.error(message);
        },
      });
  }

  pendingChangeMessage = computed(() => {
    const pending = this.pendingChange();
    if (!pending) return '';

    const die = this.die();
    const delta = pending.hits - die.hits;
    const hitsLine =
      delta > 0 ? `Golpes: ${die.hits} → ${pending.hits} (+${delta})` : `Golpes: ${pending.hits} (sin cambio)`;
    const notesLine = pending.notes?.trim() ? `Notas: "${pending.notes.trim()}"` : 'Sin notas nuevas.';

    return `${hitsLine}. ${notesLine}`;
  });

  hitsPercentage(): number | null {
    const die = this.die();
    if (!die.hitsThreshold) return null;
    return Math.min(100, Math.round((die.hits / die.hitsThreshold) * 100));
  }
}
