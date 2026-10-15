import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../data/auth.service';
import { UserRole } from '../../models/user.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private router = inject(Router);
  private authService = inject(AuthService);

  private currentUrl = signal(this.router.url);

  user = this.authService.user;
  isAdmin = this.authService.isAdmin;
  isOperator = computed(() => this.authService.user()?.role === UserRole.OPERATOR);

  constructor() {
    this.router.events.pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd)).subscribe((e) => {
      this.currentUrl.set(e.urlAfterRedirects);
    });
  }

  isSearchActive = computed(() => {
    const url = this.currentUrl();
    return url === '/dies' || /^\/dies\/\d+(\/maintenance)?$/.test(url);
  });

  isScanActive = computed(() => this.currentUrl().startsWith('/escanear'));
  isListActive =computed(() => this.currentUrl().startsWith('/dies/listado'));
  isCreateActive = computed(() => this.currentUrl().startsWith('/dies/nuevo'));
  isAlertsActive = computed(() => this.currentUrl().startsWith('/dies/alertas'));
  isLocationsActive = computed(() => this.currentUrl().startsWith('/ubicaciones'));
  isUsersActive = computed(() => this.currentUrl().startsWith('/usuarios'));

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
