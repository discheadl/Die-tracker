import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../shared/toast/toast.service';
import { AuthService } from './auth.service';
import { DieService } from './die.service';
import { findDieByNumber } from './die-lookup';
import { ScanDetector } from './scan-detector';

export type ScanResult = 'opened' | 'not-found' | 'error';

@Injectable({ providedIn: 'root' })
export class DieScanService {
  private dieService = inject(DieService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  private detector = new ScanDetector();
  private listening = false;

  listen(): void {
    if (this.listening) return;
    this.listening = true;
    document.addEventListener('keydown', (event) => this.onKeydown(event), true);
  }

  async open(scanned: string): Promise<ScanResult> {
    try {
      const dies = await firstValueFrom(this.dieService.getAll());
      const die = findDieByNumber(dies, scanned);
      if (!die) return 'not-found';

      await this.router.navigate(['/dies', die.id]);
      return 'opened';
    } catch {
      return 'error';
    }
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.authService.isAuthenticated()) return;
    if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;
    if (this.isEditable(event.target)) {
      this.detector.reset();
      return;
    }

    const scanned = this.detector.push(event.key, event.timeStamp);
    if (!scanned) return;

    event.preventDefault();
    this.open(scanned).then((result) => {
      if (result === 'not-found') this.toast.warning(`No existe un dado con el número "${scanned}".`);
      if (result === 'error') this.toast.error('No se pudo conectar con el servidor.');
    });
  }

  private isEditable(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) return false;
    return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
  }
}
