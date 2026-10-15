import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { DieScanService } from './data/die-scan.service';
import { Header } from './layout/header/header';
import { ToastContainer } from './shared/toast/toast-container';

@Component({
  imports: [RouterOutlet, Header, ToastContainer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private router = inject(Router);

  private currentUrl = signal(this.router.url);

  constructor() {
    inject(DieScanService).listen();

    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.currentUrl.set(e.urlAfterRedirects);
    });
  }

  showChrome = computed(() => !this.currentUrl().startsWith('/login'));
}
