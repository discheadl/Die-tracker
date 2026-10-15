import { Routes } from '@angular/router';
import { SearchDie } from './search-die/search-die';
import { MaintenanceHistory } from './search-die/maintenance-history/maintenance-history';
import { DiesList } from './dies-list/dies-list';
import { CreateDie } from './create-die/create-die';
import { MaintenanceAlerts } from './maintenance-alerts/maintenance-alerts';
import { Locations } from './locations/locations';
import { Login } from './login/login';
import { UsersAdmin } from './users/users-admin';
import { authGuard, adminGuard } from './data/auth.guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  {
    path: '',
    canActivateChild: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dies' },
      { path: 'dies', component: SearchDie },
      { path: 'escanear', loadComponent: () => import('./scan-die/scan-die').then((m) => m.ScanDie) },
      { path: 'dies/listado', component: DiesList },
      { path: 'dies/nuevo', component: CreateDie, canActivate: [adminGuard] },
      { path: 'dies/alertas', component: MaintenanceAlerts },
      { path: 'ubicaciones', component: Locations, canActivate: [adminGuard] },
      { path: 'usuarios', component: UsersAdmin, canActivate: [adminGuard] },
      { path: 'dies/:id', component: SearchDie },
      { path: 'dies/:id/maintenance', component: MaintenanceHistory },
      { path: '**', redirectTo: 'dies' },
    ],
  },
];
