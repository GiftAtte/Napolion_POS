import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  createProduct(data: any) {
    return this.http.post<any>(`${API}/products`, data);
  }
  getProduct(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/products/?page=${page}&pageSize=${pageSize}`
    );
  }
  putProduct(data: any) {
    return this.http.put<any>(`${API}/products/${data.id}`, data);
  }
  public deleteProduct(id: string) {
    return this.http.delete<any>(`${API}/products/${id}`);
  }

  loadProductEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadProductEvent.emit(null);
  }

  getAllProduct() {
    return this.http.get<any>(`${API}/products`);
  }
}
