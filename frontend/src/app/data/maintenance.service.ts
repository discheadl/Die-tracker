import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CreateMaintenancePayload, Maintenance, UpdateMaintenancePayload } from '../models/maintenance.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE_URL}/maintenance`;

  getAll(): Observable<Maintenance[]> {
    return this.http.get<Maintenance[]>(this.baseUrl);
  }

  create(payload: CreateMaintenancePayload): Observable<Maintenance> {
    return this.http.post<Maintenance>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateMaintenancePayload): Observable<Maintenance> {
    return this.http.patch<Maintenance>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
