import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DieService } from '../data/die.service';
import { LocationService } from '../data/location.service';
import { Die, DieStatus, getDieStatusLabel } from '../models/die.model';
import { Location } from '../models/location.model';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { ToastService } from '../shared/toast/toast.service';
import { AuthService } from '../data/auth.service';

type SortOption = 'hits-desc' | 'hits-asc' | 'dieNumber';

@Component({
  selector: 'app-dies-list',
  imports: [ConfirmDialog],
  templateUrl: './dies-list.html',
  styleUrl: './dies-list.css',
})
export class DiesList {
  private dieService = inject(DieService);
  private locationService = inject(LocationService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private authService = inject(AuthService);

  isAdmin = this.authService.isAdmin;

  dies = signal<Die[]>([]);
  locations = signal<Location[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  pendingDelete = signal<Die | null>(null);
  deleting = signal(false);

  statusFilter = signal<DieStatus | ''>('');
  locationFilter = signal<number | ''>('');
  sortBy = signal<SortOption>('hits-desc');

  statusOptions = [
    { value: DieStatus.RUN, label: getDieStatusLabel(DieStatus.RUN) },
    { value: DieStatus.RUN_SOMETIMES, label: getDieStatusLabel(DieStatus.RUN_SOMETIMES) },
    { value: DieStatus.NOT_RUNNING, label: getDieStatusLabel(DieStatus.NOT_RUNNING) },
  ];

  getDieStatusLabel = getDieStatusLabel;

  filteredDies = computed(() => {
    const status = this.statusFilter();
    const locationId = this.locationFilter();

    let list = this.dies();

    if (status) {
      list = list.filter((d) => d.status === status);
    }

    if (locationId !== '') {
      list = list.filter((d) => d.location?.id === locationId);
    }

    const sort = this.sortBy();
    list = [...list].sort((a, b) => {
      if (sort === 'hits-desc') return b.hits - a.hits;
      if (sort === 'hits-asc') return a.hits - b.hits;
      return a.dieNumber.localeCompare(b.dieNumber);
    });

    return list;
  });

  constructor() {
    this.loadDies();
    this.loadLocations();
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

  loadLocations(): void {
    this.locationService.getAll().subscribe({
      next: (locations) => this.locations.set(locations),
      error: () => this.locations.set([]),
    });
  }

  onStatusFilterChange(event: Event): void {
    this.statusFilter.set((event.target as HTMLSelectElement).value as DieStatus | '');
  }

  onLocationFilterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.locationFilter.set(value === '' ? '' : Number(value));
  }

  onSortChange(event: Event): void {
    this.sortBy.set((event.target as HTMLSelectElement).value as SortOption);
  }

  clearFilters(): void {
    this.statusFilter.set('');
    this.locationFilter.set('');
  }

  hitsPercentage(die: Die): number | null {
    if (!die.hitsThreshold) return null;
    return Math.min(100, Math.round((die.hits / die.hitsThreshold) * 100));
  }

  viewDie(id: number): void {
    this.router.navigate(['/dies', id]);
  }

  requestDelete(event: MouseEvent, die: Die): void {
    event.stopPropagation();
    this.pendingDelete.set(die);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const die = this.pendingDelete();
    if (!die) return;

    this.deleting.set(true);
    this.dieService.remove(die.id).subscribe({
      next: () => {
        this.dies.update((list) => list.filter((d) => d.id !== die.id));
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.success(`Dado ${die.dieNumber} eliminado.`);
      },
      error: () => {
        this.deleting.set(false);
        this.pendingDelete.set(null);
        this.toast.error(`No se pudo eliminar el dado ${die.dieNumber}. Intenta nuevamente.`);
      },
    });
  }
}
