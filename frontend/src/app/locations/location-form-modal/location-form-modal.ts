import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LocationService } from '../../data/location.service';
import { Location, LocationType, getLocationTypeLabel } from '../../models/location.model';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-location-form-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './location-form-modal.html',
  styleUrl: './location-form-modal.css',
})
export class LocationFormModal {
  close = output<void>();
  created = output<Location>();

  private locationService = inject(LocationService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  saving = signal(false);
  errorMsg = signal<string | null>(null);

  typeOptions = [
    { value: LocationType.STORAGE, label: getLocationTypeLabel(LocationType.STORAGE) },
    { value: LocationType.PRESS_POSITION, label: getLocationTypeLabel(LocationType.PRESS_POSITION) },
  ];

  form = this.fb.nonNullable.group({
    type: [LocationType.STORAGE, Validators.required],
    name: ['', Validators.required],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = 'Falta el nombre de la ubicación.';
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    this.saving.set(true);
    this.errorMsg.set(null);

    this.locationService.create(this.form.getRawValue()).subscribe({
      next: (location) => {
        this.saving.set(false);
        this.toast.success(`Ubicación "${location.name}" creada correctamente.`);
        this.created.emit(location);
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
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.close.emit();
    }
  }
}
