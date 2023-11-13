import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  createCustomer(data: any) {
    return this.http.post<any>(`${API}/customers`, data);
  }
  getCustomer(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/customers/?page=${page}&pageSize=${pageSize}`
    );
  }
  putCustomer(data: any) {
    return this.http.put<any>(`${API}/customers/${data.id}`, data);
  }
  public deleteCustomer(id: string) {
    return this.http.delete<any>(`${API}/customers/${id}`);
  }

  getAllCustomer() {
    return this.http.get<any>(`${API}/customers`);
  }

  loadCategorEvent = new EventEmitter<any>();

  raiseLoadEvent() {
    this.loadCategorEvent.emit(null);
  }
  getCustomerById(id:string){
    return this.http.get<any>(`${API}/customers/${id}`)
  }

  getAccountBalance(id:string){
    return this.http.get<any>(`${API}/customers/agent/accountBalance/${id}`)
  }

  updateAgentAccount(data: any) {
    return this.http.post<any>(`${API}/customers/agent/account`, data);
  }
}
