
import { tap } from 'rxjs';
import { AppService } from './../services/app.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { DepartmentFormComponent } from './department-form/department-form.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss'],
})
export class DepartmentComponent {
  tableTitle = 'Department List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  category = [];
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Department Name', dataKey: 'name' },
    { name: 'Modified At', dataKey: 'createdAt' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
 
  ) {}

  ngOnInit() {
    this.getDepartment();
    this.appService.loadAppEvent.subscribe(() => {
      this.getDepartment();
    });
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getDepartment())).subscribe();
  }

  getDepartment() {
    this.isLoading = true;
    this.appService
      .getDepartment(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 5)
      .subscribe({
        next: (res) => {
          this.data = this.formatDate(res.data);
          this.totalData = res.length;
         // console.log(this.data);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  deleteDepartment(data: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'cancel',
      cancelButtonColor: 'green',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.value) {
        this.appService.deleteDepartment(data._id).subscribe({
          next: (res) => {
            this.getDepartment();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openDepartmentForm(data: any) {
    let payload = {
      modalTitle: 'New Department',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Department';
    }

    this.dialog.open(DepartmentFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }

  formatDate(data: any[]): any[] {
    const formatedData: any[] = [];
    data.forEach((element) => {
      element.createdAt = moment(element.createdAt).format('MMMM Do YYYY');
      formatedData.push(element);
    });
    return formatedData;
  }
}
