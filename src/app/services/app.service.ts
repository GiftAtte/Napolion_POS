import { API } from './../appConfig';
import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private http: HttpClient) {}

  createApp(data: any) {
    return this.http.post<any>(`${API}/appSettings`, data);
  }
  getApp(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/appSettings?page=${page}&pageSize=${pageSize}`
    );
  }
  putApp(data: any) {
    return this.http.put<any>(`${API}/appSettings/${data.id}`, data);
  }
  public deleteApp(id: string) {
    return this.http.delete<any>(`${API}/appSettings/${id}`);
  }

  loadAppEvent = new EventEmitter<any>();

  loadEventEmitter(data: any) {
    this.loadAppEvent.emit(data);
  }

  // DEPARTMENT SETTINGS

  createDepartment(data: any) {
    return this.http.post<any>(`${API}/departments`, data);
  }
  getDepartment(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/departments?page=${page}&pageSize=${pageSize}`
    );
  }
  putDepartment(data: any) {
    return this.http.put<any>(`${API}/departments/${data.id}`, data);
  }
  public deleteDepartment(id: string) {
    return this.http.delete<any>(`${API}/departments/${id}`);
  }





  // filter an array

  public filter(value: string,options:any): string[] {
    const filterValue = value.toLowerCase();

    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
