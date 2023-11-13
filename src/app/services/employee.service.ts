import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { API } from '../appConfig';
import { catchError, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  createEmployees(data: any) {
    return this.http.post<any>(`${API}/employees`, data);
  }
  getPEmployees(page: number, pageSize: number) {
    return this.http.get<any>(
      `${API}/employees?page=${page}&pageSize=${pageSize}`
    );
  }
  putEmployees(data: any) {
    return this.http.put<any>(`${API}/employees/${data.id}`, data);
  }
  public deleteEmployees(id: string) {
    return this.http.delete<any>(`${API}/employees/${id}`);
  }

  public getEmployee(id: string) {
    return this.http.get<any>(`${API}/employees/${id}`);
  }

  public uploadProfileImg(userInfo: any) {
    const formData: any = new FormData();
    formData.append('photo', userInfo.photo);
    formData.append('id', userInfo.id);
    console.log(userInfo);
    return this.http
      .put<any>(`${API}/users/${userInfo.id}`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }

  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }

  putUsers(data: any) {
    return this.http.put<any>(`${API}/auth/${data.id}`, data);
  }

  putPassword(data: any) {
    return this.http.post<any>(`${API}/auth/password/updatepassword`, data);
  }



}


