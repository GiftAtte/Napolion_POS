import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { API } from '../appConfig';


interface  dateObj {
    startDate: Date,
    endDate:Date
  }

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private http: HttpClient) {}

  createTransaction(data: any) {
    return this.http.post<any>(`${API}/transactions`, data);
  }
  getTransaction(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/transactions/?page=${page}&pageSize=${pageSize}`
    );
  }

  getTransactionById(id: string) {
    return this.http.get<any>(`${API}/transactions/${id}`);
  }

  putTransaction(data: any) {
    return this.http.put<any>(`${API}/transactions/${data.id}`, data);
  }
  public deleteTransaction(id: string) {
    return this.http.delete<any>(`${API}/transactions/${id}`);
  }

  loadProductEvent = new EventEmitter<any>();
  paymentOptionEvent = new EventEmitter<any>();

  postOption(option: any) {
    this.paymentOptionEvent.emit(option);
  }
  //LOAD PRODUCT
  getAllProduct() {
    return this.http.get<any>(`${API}/transactions`);
  }

  //LOAD SALES

  getSales(datesObject: any) {
    return this.http.post<any>(`${API}/transactions/sales/salesByDate`, datesObject);
  }
  // TODAY'S SALES
  getTodaySales() {
    return this.http.get<any>(`${API}transactions/sales/transactions`);
  }

  // OUT OF STOCK
  getOutOfStock() {
    return this.http.get<any>(`${API}stock/outOfStock/stock`);
  }

  getCustomerTranactions(customerId:string){
    return this.http.get<any>(`${API}/transactions/salesPerson/${customerId}`)
  }


// DRAFT ROUTES
  getDraft(){
    return this.http.get<any>(`${API}/drafts`)
  }

  public deleteDraft(id: string) {
    return this.http.delete<any>(`${API}/drafts/${id}`);
  }


  createDraft(data: any) {
    return this.http.post<any>(`${API}/drafts`, data);
  }

  getCurrentStock(productId:string){

     return this.http.get<any>(`${API}/stock/${productId}`)
  }

}
