import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DieService } from '../data/die.service';
import { LocationService } from '../data/location.service';
import { Die } from '../models/die.model';
import { Location } from '../models/location.model';
import { DieSearchList } from './die-search-list/die-search-list';
import { DieDetail } from './die-detail/die-detail';

@Component({
  imports: [DieSearchList, DieDetail],
  selector: 'app-search-die',
  styleUrl: './search-die.css',
  templateUrl: './search-die.html',
})
export class SearchDie {
  private dieService = inject(DieService);
  private locationService = inject(LocationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  dies = signal<Die[]>([]);
  locations = signal<Location[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  selectedId = signal<number | null>(null);

  selectedDie = computed(() => this.dies().find((d) => d.id === this.selectedId()) ?? null);

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      this.selectedId.set(idParam ? Number(idParam) : null);
    });

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

  selectDie(id: number): void {
    this.router.navigate(['/dies', id]);
  }

  onDieUpdated(updated: Die): void {
    this.dies.update((list) => list.map((d) => (d.id === updated.id ? updated : d)));
  }

  onLocationCreated(location: Location): void {
    this.locations.update((list) => (list.some((l) => l.id === location.id) ? list : [...list, location]));
  }
}
