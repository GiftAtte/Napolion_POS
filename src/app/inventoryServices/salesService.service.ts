import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) {}

  createPayment(data: any) {
    return this.http.post<any>(`${API}/products`, data);
  }
  getPayment(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/products/?page=${page}&pageSize=${pageSize}`
    );
  }
  putPayment(data: any) {
    return this.http.put<any>(`${API}/products/${data.id}`, data);
  }
  public deletePayment(id: string) {
    return this.http.delete<any>(`${API}/products/${id}`);
  }

  loadProductEvent = new EventEmitter<any>();
  paymentOptionEvent = new EventEmitter<any>();

 
  postOption(option:string) {
    this.paymentOptionEvent.emit(option)
  }

  getAllProduct() {
    return this.http.get<any>(`${API}/products`);
  }
}
