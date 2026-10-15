import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { DieScanService } from '../data/die-scan.service';

@Component({
  selector: 'app-scan-die',
  templateUrl: './scan-die.html',
  styleUrl: './scan-die.css',
})
export class ScanDie implements AfterViewInit {
  private scanService = inject(DieScanService);

  private scanInput = viewChild.required<ElementRef<HTMLInputElement>>('scanInput');

  searching = signal(false);
  errorMsg = signal<string | null>(null);

  ngAfterViewInit(): void {
    this.scanInput().nativeElement.focus();
  }

  async onSubmit(event: Event): Promise<void> {
    event.preventDefault();

    const input = this.scanInput().nativeElement;
    const scanned = input.value.trim();
    if (!scanned || this.searching()) return;

    this.searching.set(true);
    this.errorMsg.set(null);

    const result = await this.scanService.open(scanned);
    this.searching.set(false);

    if (result === 'opened') return;

    this.errorMsg.set(
      result === 'not-found'
        ? `No existe un dado con el número "${scanned}".`
        : 'No se pudo conectar con el servidor.',
    );
    input.value = '';
    input.focus();
  }
}
