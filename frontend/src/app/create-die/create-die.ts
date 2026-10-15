import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DieService } from '../data/die.service';
import { LocationService } from '../data/location.service';
import { DieStatus, getDieStatusLabel } from '../models/die.model';
import { Location } from '../models/location.model';
import { LocationFormModal } from '../locations/location-form-modal/location-form-modal';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-create-die',
  imports: [ReactiveFormsModule, RouterLink, LocationFormModal],
  templateUrl: './create-die.html',
  styleUrl: './create-die.css',
})
export class CreateDie {
  private dieService = inject(DieService);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  locations = signal<Location[]>([]);
  saving = signal(false);
  errorMsg = signal<string | null>(null);
  showLocationModal = signal(false);

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
    this.loadLocations();
  }

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (locations) => this.locations.set(locations),
      error: () => this.locations.set([]),
    });
  }

  openLocationModal(): void {
    this.showLocationModal.set(true);
  }

  closeLocationModal(): void {
    this.showLocationModal.set(false);
  }

  onLocationCreated(location: Location): void {
    this.locations.update((list) => [...list, location]);
    this.form.patchValue({ locationId: location.id });
    this.showLocationModal.set(false);
  }

  private describeValidationError(): string {
    if (this.form.controls.dieNumber.hasError('required')) {
      return 'Falta el número de dado.';
    }
    if (this.form.controls.hits.hasError('required')) {
      return 'Ingresa los golpes (hits).';
    }
    if (this.form.controls.hits.hasError('min')) {
      return 'Los golpes no pueden ser negativos.';
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
    this.saving.set(true);
    this.errorMsg.set(null);

    this.dieService
      .create({
        dieNumber: value.dieNumber,
        rotorNumber: value.rotorNumber || undefined,
        statorNumber: value.statorNumber || undefined,
        status: value.status,
        locationId: value.locationId ?? undefined,
        hits: value.hits,
        hitsThreshold: value.hitsThreshold ?? undefined,
        notes: value.notes,
      })
      .subscribe({
        next: (created) => {
          this.saving.set(false);
          this.toast.success(`Dado ${created.dieNumber} creado correctamente.`);
          this.router.navigate(['/dies', created.id]);
        },
        error: (err) => {
          this.saving.set(false);
          const message =
            err?.status === 409 || err?.status === 400
              ? 'No se pudo crear el dado. Verifica que el número de dado no esté repetido.'
              : 'No se pudo crear el dado. Intenta nuevamente.';
          this.errorMsg.set(message);
          this.toast.error(message);
        },
      });
  }
}
