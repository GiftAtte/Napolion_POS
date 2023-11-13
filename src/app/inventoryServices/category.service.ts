import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  createCategory(data: any) {
    return this.http.post<any>(`${API}/category`, data);
  }
  getCategory(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/category/?page=${page}&pageSize=${pageSize}`
    );
  }
  putCategory(data: any) {
    return this.http.put<any>(`${API}/category/${data.id}`, data);
  }
  public deleteCategory(id: string) {
    return this.http.delete<any>(`${API}/category/${id}`);
  }

  getAllCategory() {
    return this.http.get<any>(
      `${API}/category`
    );
  }

  loadCategorEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadCategorEvent.emit(null);
  }
}
