import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CreateDiePayload, Die, UpdateDiePayload } from '../models/die.model';

@Injectable({ providedIn: 'root' })
export class DieService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE_URL}/die`;

  getAll(): Observable<Die[]> {
    return this.http.get<Die[]>(this.baseUrl);
  }

  create(payload: CreateDiePayload): Observable<Die> {
    return this.http.post<Die>(this.baseUrl, payload);
  }

  getOne(id: number): Observable<Die> {
    return this.http.get<Die>(`${this.baseUrl}/${id}`);
  }

  update(id: number, payload: UpdateDiePayload): Observable<Die> {
    return this.http.patch<Die>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
