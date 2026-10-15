import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'warning' | 'error';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  leaving: boolean;
}

const DEFAULT_DURATION = 3500;
const ERROR_DURATION = 5500;
const LEAVE_DURATION = 250;

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  private nextId = 0;

  success(message: string): void {
    this.show('success', message, DEFAULT_DURATION);
  }

  warning(message: string): void {
    this.show('warning', message, ERROR_DURATION);
  }

  error(message: string): void {
    this.show('error', message, ERROR_DURATION);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => {
      this.toasts.update((list) => list.filter((t) => t.id !== id));
    }, LEAVE_DURATION);
  }

  private show(type: ToastType, message: string, duration: number): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, type, message, leaving: false }]);
    setTimeout(() => this.dismiss(id), duration);
  }
}
