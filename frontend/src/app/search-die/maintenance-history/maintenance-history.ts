import { Component, computed, inject, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DieService } from '../../data/die.service';
import { MaintenanceService } from '../../data/maintenance.service';
import { Die, getDieStatusLabel } from '../../models/die.model';
import { Maintenance, MaintenanceType, getMaintenancePriority } from '../../models/maintenance.model';
import { ToastService } from '../../shared/toast/toast.service';
import { AuthService } from '../../data/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-maintenance-history',
  imports: [ReactiveFormsModule, RouterLink, SlicePipe],
  templateUrl: './maintenance-history.html',
  styleUrl: './maintenance-history.css',
})
export class MaintenanceHistory {
  private route = inject(ActivatedRoute);
  private dieService = inject(DieService);
  private maintenanceService = inject(MaintenanceService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  isAdmin = this.authService.isAdmin;
  canManage = computed(() => {
    const role = this.authService.user()?.role;
    return role === UserRole.ADMIN || role === UserRole.MAINTENANCE;
  });

  dieId = signal<number | null>(null);
  die = signal<Die | null>(null);
  records = signal<Maintenance[]>([]);

  loading = signal(true);
  errorMsg = signal<string | null>(null);
  saving = signal(false);

  addingNew = signal(false);
  editingId = signal<number | null>(null);

  form = this.fb.nonNullable.group({
    performedAt: ['', Validators.required],
    hitsAtMaintenance: [0, [Validators.required, Validators.min(0)]],
    notes: [''],
  });

  sortedRecords = computed(() =>
    [...this.records()].sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()),
  );

  getDieStatusLabel = getDieStatusLabel;

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.dieId.set(id);
      this.loadDie(id);
      this.loadRecords(id);
    });
  }

  loadDie(id: number): void {
    this.dieService.getOne(id).subscribe({
      next: (die) => this.die.set(die),
      error: () => this.errorMsg.set('No se pudo cargar la información del dado.'),
    });
  }

  loadRecords(dieId: number): void {
    this.loading.set(true);
    this.maintenanceService.getAll().subscribe({
      next: (all) => {
        this.records.set(all.filter((m) => m.die?.id === dieId));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar el historial de mantenimiento.');
        this.loading.set(false);
      },
    });
  }

  startAdd(): void {
    this.errorMsg.set(null);
    this.editingId.set(null);
    this.addingNew.set(true);
    this.form.reset({
      performedAt: '',
      hitsAtMaintenance: this.die()?.hits ?? 0,
      notes: '',
    });
  }

  startEdit(record: Maintenance): void {
    this.errorMsg.set(null);
    this.addingNew.set(false);
    this.editingId.set(record.id);
    this.form.reset({
      performedAt: record.performedAt.slice(0, 10),
      hitsAtMaintenance: record.hitsAtMaintenance,
      notes: record.notes ?? '',
    });
  }

  cancel(): void {
    this.addingNew.set(false);
    this.editingId.set(null);
  }

  private computePriority(hits: number): MaintenanceType {
    const threshold = this.die()?.hitsThreshold;
    if (!threshold || threshold <= 0) return MaintenanceType.LOW;
    return getMaintenancePriority((hits / threshold) * 100) ?? MaintenanceType.LOW;
  }

  private describeValidationError(): string {
    if (this.form.controls.performedAt.hasError('required')) {
      return 'Selecciona la fecha del mantenimiento.';
    }
    if (this.form.controls.hitsAtMaintenance.hasError('required')) {
      return 'Ingresa los golpes al momento del mantenimiento.';
    }
    if (this.form.controls.hitsAtMaintenance.hasError('min')) {
      return 'Los golpes no pueden ser negativos.';
    }
    return 'Revisa los datos del formulario, algo no es válido.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = this.describeValidationError();
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    const value = this.form.getRawValue();
    const dieId = this.dieId();
    if (dieId === null) return;

    const type = this.computePriority(value.hitsAtMaintenance);

    this.saving.set(true);
    this.errorMsg.set(null);

    if (this.addingNew()) {
      this.maintenanceService.create({ ...value, type, dieId }).subscribe({
        next: (created) => {
          this.records.update((list) => [...list, created]);
          this.saving.set(false);
          this.addingNew.set(false);
          this.toast.success('Mantenimiento registrado correctamente.');
        },
        error: () => {
          this.saving.set(false);
          const message = 'No se pudo crear el registro de mantenimiento.';
          this.errorMsg.set(message);
          this.toast.error(message);
        },
      });
      return;
    }

    const id = this.editingId();
    if (id === null) return;

    this.maintenanceService.update(id, { ...value, type }).subscribe({
      next: (updated) => {
        this.records.update((list) => list.map((r) => (r.id === id ? updated : r)));
        this.saving.set(false);
        this.editingId.set(null);
        this.toast.success('Registro de mantenimiento actualizado.');
      },
      error: () => {
        this.saving.set(false);
        const message = 'No se pudo actualizar el registro de mantenimiento.';
        this.errorMsg.set(message);
        this.toast.error(message);
      },
    });
  }

  remove(id: number): void {
    if (!confirm('¿Eliminar este registro de mantenimiento?')) return;

    this.maintenanceService.remove(id).subscribe({
      next: () => {
        this.records.update((list) => list.filter((r) => r.id !== id));
        this.toast.success('Registro de mantenimiento eliminado.');
      },
      error: () => {
        const message = 'No se pudo eliminar el registro.';
        this.errorMsg.set(message);
        this.toast.error(message);
      },
    });
  }
}
