import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../data/user.service';
import { ToastService } from '../shared/toast/toast.service';
import { ConfirmDialog } from '../shared/confirm-dialog/confirm-dialog';
import { User, UserRole, getUserRoleLabel } from '../models/user.model';

@Component({
  selector: 'app-users-admin',
  imports: [ReactiveFormsModule, ConfirmDialog],
  templateUrl: './users-admin.html',
  styleUrl: './users-admin.css',
})
export class UsersAdmin {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  users = signal<User[]>([]);
  loading = signal(true);
  errorMsg = signal<string | null>(null);
  saving = signal(false);
  pendingDelete = signal<User | null>(null);

  roleOptions = [
    { value: UserRole.ADMIN, label: getUserRoleLabel(UserRole.ADMIN) },
    { value: UserRole.OPERATOR, label: getUserRoleLabel(UserRole.OPERATOR) },
    { value: UserRole.MAINTENANCE, label: getUserRoleLabel(UserRole.MAINTENANCE) },
  ];

  getUserRoleLabel = getUserRoleLabel;

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: [UserRole.OPERATOR, Validators.required],
  });

  constructor() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('No se pudo conectar con el servidor.');
        this.loading.set(false);
      },
    });
  }

  private describeValidationError(): string {
    const username = this.form.controls.username;
    const password = this.form.controls.password;

    if (username.hasError('required')) return 'Falta el nombre de usuario.';
    if (password.hasError('required')) return 'Falta la contraseña.';
    if (password.hasError('minlength')) return 'La contraseña debe tener al menos 8 caracteres.';
    return 'Revisa los datos del formulario, algo no es válido.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const message = this.describeValidationError();
      this.errorMsg.set(message);
      this.toast.warning(message);
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.errorMsg.set(null);

    this.userService.create(value).subscribe({
      next: (created) => {
        this.users.update((list) => [...list, created]);
        this.saving.set(false);
        this.form.reset({ username: '', password: '', role: UserRole.OPERATOR });
        this.toast.success(`Usuario "${created.username}" creado correctamente.`);
      },
      error: (err) => {
        this.saving.set(false);
        const message =
          err?.status === 409
            ? 'Ya existe un usuario con ese nombre.'
            : 'No se pudo crear el usuario. Intenta nuevamente.';
        this.errorMsg.set(message);
        this.toast.error(message);
      },
    });
  }

  requestDelete(user: User): void {
    this.pendingDelete.set(user);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const user = this.pendingDelete();
    if (!user) return;

    this.userService.remove(user.id).subscribe({
      next: () => {
        this.users.update((list) => list.filter((u) => u.id !== user.id));
        this.pendingDelete.set(null);
        this.toast.success(`Usuario "${user.username}" eliminado.`);
      },
      error: () => {
        this.pendingDelete.set(null);
        this.toast.error(`No se pudo eliminar el usuario "${user.username}".`);
      },
    });
  }
}
