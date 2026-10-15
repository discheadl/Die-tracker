import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DieService } from '../data/die.service';
import { Die, getDieStatusLabel } from '../models/die.model';
import { MaintenanceType, getMaintenanceTypeLabel, getMaintenancePriority } from '../models/maintenance.model';
import { AuthService } from '../data/auth.service';
import { UserRole } from '../models/user.model';

export interface DieAlert {
  die: Die;
  percentage: number;
  priority: MaintenanceType;
}

@Component({
  selector: 'app-maintenance-alerts',
  imports: [],
  templateUrl: './maintenance-alerts.html',
  styleUrl: './maintenance-alerts.css',
})
export class MaintenanceAlerts {
  private dieService = inject(DieService);
  private router = inject(Router);
  private authService = inject(AuthService);

  canManage = computed(() => {
    const role = this.authService.user()?.role;
    return role === UserRole.ADMIN || role === UserRole.MAINTENANCE;
  });

  dies = signal<Die[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);

  getDieStatusLabel = getDieStatusLabel;
  getMaintenanceTypeLabel = getMaintenanceTypeLabel;

  alerts = computed<DieAlert[]>(() => {
    const list = this.dies()
      .filter((d) => !!d.hitsThreshold && d.hitsThreshold > 0)
      .map((d) => {
        const percentage = Math.round((d.hits / d.hitsThreshold!) * 100);
        const priority = getMaintenancePriority(percentage);
        return priority ? { die: d, percentage, priority } : null;
      })
      .filter((alert): alert is DieAlert => alert !== null);

    return list.sort((a, b) => b.percentage - a.percentage);
  });

  lowCount = computed(() => this.alerts().filter((a) => a.priority === MaintenanceType.LOW).length);
  mediumCount = computed(() => this.alerts().filter((a) => a.priority === MaintenanceType.MEDIUM).length);
  highCount = computed(() => this.alerts().filter((a) => a.priority === MaintenanceType.HIGH).length);

  constructor() {
    this.loadDies();
  }

  loadDies(): void {
    this.loading.set(true);
    this.dieService.getAll().subscribe({
      next: (dies) => {
        this.dies.set(dies);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo conectar con el servidor.');
        this.loading.set(false);
      },
    });
  }

  goToMaintenance(dieId: number): void {
    this.router.navigate(['/dies', dieId, 'maintenance']);
  }

  goToDie(dieId: number): void {
    this.router.navigate(['/dies', dieId]);
  }
}
