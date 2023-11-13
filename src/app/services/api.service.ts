import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from '../appConfig';
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  createProduct(data: any) {
    return this.http.post<any>(`${API}/products`, data);
  }
  getProducts() {
    return this.http.get<any>(`${API}/products`);
  }
  putProduct(data: any) {
    return this.http.put<any>(`${API}/products`, +data.id * 1, data);
  }
  deleteProduct(id: number) {
    return this.http.delete<any>(`${API}/products` + id);
  }

  getTransaction(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/transactions/?page=${page}&pageSize=${pageSize}`
    );
  }
}
