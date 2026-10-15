import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../data/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);

  loading = signal(false);
  errorMsg = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg.set('Ingresa usuario y contraseña.');
      return;
    }

    const { username, password } = this.form.getRawValue();
    this.loading.set(true);
    this.errorMsg.set(null);

    this.authService.login(username, password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.returnUrl());
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMsg.set(
          err?.status === 401 ? 'Usuario o contraseña incorrectos.' : 'No se pudo iniciar sesión. Intenta nuevamente.',
        );
      },
    });
  }

  private returnUrl(): string {
    const target = this.route.snapshot.queryParamMap.get('returnUrl');
    const isInternal = !!target && target.startsWith('/') && !target.startsWith('//');
    return isInternal && !target.startsWith('/login') ? target : '/dies';
  }
}
