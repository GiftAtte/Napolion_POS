import { API } from './../appConfig';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  constructor(private http: HttpClient) {}

  createPrice(data: any) {
    return this.http.post<any>(`${API}/prices`, data);
  }
  getPrice(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/prices/?page=${page}&pageSize=${pageSize}`
    );
  }
  putPrice(data: any) {
    return this.http.put<any>(`${API}/prices/${data.id}`, data);
  }
  public deletePrice(id: string) {
    return this.http.delete<any>(`${API}/prices/${id}`);
  }

  loadPriceEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadPriceEvent.emit(null);
  }

  getAllProduct() {
    return this.http.get<any>(`${API}/products`);
  }
}
