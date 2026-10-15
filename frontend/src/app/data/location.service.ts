import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { CreateLocationPayload, Location, UpdateLocationPayload } from '../models/location.model';

@Injectable({ providedIn: 'root' })
export class LocationService {
  private http = inject(HttpClient);
  private baseUrl = `${API_BASE_URL}/locations`;

  getAll(): Observable<Location[]> {
    return this.http.get<Location[]>(this.baseUrl);
  }

  getOne(id: number): Observable<Location> {
    return this.http.get<Location>(`${this.baseUrl}/${id}`);
  }

  create(payload: CreateLocationPayload): Observable<Location> {
    return this.http.post<Location>(this.baseUrl, payload);
  }

  update(id: number, payload: UpdateLocationPayload): Observable<Location> {
    return this.http.patch<Location>(`${this.baseUrl}/${id}`, payload);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
