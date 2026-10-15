import { Component, computed, input, output, signal } from '@angular/core';
import { findDieByNumber } from '../../data/die-lookup';
import { Die, getDieStatusLabel } from '../../models/die.model';

@Component({
  selector: 'app-die-search-list',
  imports: [],
  templateUrl: './die-search-list.html',
  styleUrl: './die-search-list.css',
})
export class DieSearchList {
  dies = input<Die[]>([]);
  loading = input<boolean>(false);
  errorMsg = input<string | null>(null);
  selectedId = input<number | null>(null);

  select = output<number>();

  searchTerm = signal('');

  filteredDies = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.dies();
    if (!term) return list;

    return list.filter(
      (die) =>
        die.dieNumber.toLowerCase().includes(term) ||
        (die.rotorNumber?.toLowerCase().includes(term) ?? false) ||
        (die.statorNumber?.toLowerCase().includes(term) ?? false),
    );
  });

  onSearchInput(event: Event): void {
    this.searchTerm.set((event.target as HTMLInputElement).value);
  }

  onEnter(): void {
    const die = findDieByNumber(this.dies(), this.searchTerm());
    if (die) this.select.emit(die.id);
  }

  statusLabel(status: Die['status']): string {
    return getDieStatusLabel(status);
  }
}
