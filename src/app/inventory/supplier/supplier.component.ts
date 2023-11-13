import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierService } from './../../inventoryServices/supplier.service';
import { tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.scss'],
  providers: [SupplierService],
})
export class SupplierComponent implements OnInit, AfterViewInit {
  tableTitle = 'Supplier List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Name', dataKey: 'name' },
    { name: 'Products', dataKey: 'products' },
    { name: 'Created At', dataKey: 'createdAt' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private supplierService: SupplierService
  ) {}

  ngOnInit() {
    this.getSupplier();
    this.supplierService.loadSupplierEvent.subscribe(() => {
      this.getSupplier();
    });
  }
  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.getSupplier())).subscribe();
  }

  getSupplier() {
    this.isLoading = true;
    this.supplierService
      .getSupplier(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 5
      )
      .subscribe({
        next: (res) => {
          this.data = this.formatDate(res.data.data);
          this.totalData = res.data.length;
          console.log(this.data);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  deleteSupplier(data: any) {
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
        this.supplierService.deleteSupplier(data._id).subscribe({
          next: (res) => {
            this.getSupplier();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openSupplierForm(data: any) {
    let payload = {
      modalTitle: 'New supplier',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update supplier';
    }

    this.dialog.open(SupplierFormComponent, {
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
