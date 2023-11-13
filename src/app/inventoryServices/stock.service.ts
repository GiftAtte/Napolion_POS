import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class StockService {
  constructor(private http: HttpClient) {}

  createStock(data: any) {
    return this.http.post<any>(`${API}/stock`, data);
  }
  getStock(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/stock/?page=${page}&pageSize=${pageSize}`
    );
  }
  putStock(data: any) {
    return this.http.put<any>(`${API}/stock/${data.id}`, data);
  }
  public deleteStock(id: string) {
    return this.http.delete<any>(`${API}/stock/${id}`);
  }

  loadStockEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadStockEvent.emit(null);
  }

  getStockStats(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/stock/stock/stats?page=${page}&pageSize=${pageSize}`
    );
  }
}
