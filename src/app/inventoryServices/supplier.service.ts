import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}

  createSupplier(data: any) {
    return this.http.post<any>(`${API}/suppliers`, data);
  }
  getSupplier(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/suppliers/?page=${page}&pageSize=${pageSize}`
    );
  }
  putSupplier(data: any) {
    return this.http.put<any>(`${API}/suppliers/${data.id}`, data);
  }
  public deleteSupplier(id: string) {
    return this.http.delete<any>(`${API}/suppliers/${id}`);
  }

  loadSupplierEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadSupplierEvent.emit(null);
  }

  getAllSupplier() {
    return this.http.get<any>(`${API}/suppliers`);
  }
}
