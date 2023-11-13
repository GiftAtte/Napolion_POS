import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomerService } from './../../inventoryServices/customer.service';
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as moment from "moment"
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss'],
})
export class CustomerComponent implements OnInit, AfterViewInit {
  tableTitle = 'SALES AGENT LIST';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Agent Name', dataKey: 'name' },
    { name: 'Phone Number', dataKey: 'phoneNumber' },
    { name: 'Email', dataKey: 'email' },
    { name: 'Account Limit', dataKey: 'accountLimit' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private router:Router
  ) {}

  ngOnInit() {
    this.getCustomer();
    this.customerService.loadCategorEvent.subscribe(() => {
      this.getCustomer();
    });
  }
  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.getCustomer())).subscribe();
  }

  getCustomer() {
    this.isLoading = true;
    this.customerService
      .getCustomer(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 25
      )
      .subscribe({
        next: (res) => {
          this.data = this.formatDate(res.data);
          this.totalData = res.length;
          console.log(this.data);
          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }

  deleteCustomer(data: any) {
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
        this.customerService.deleteCustomer(data._id).subscribe({
          next: (res) => {
            this.getCustomer();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openCustomerForm(data: any) {
    let payload = {
      modalTitle: 'New Agent',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Agent';
    }

    this.dialog.open(CustomerFormComponent, {
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

  goToAccount(data: any) {
    if (data?._id) {
      // this.router.navigate(['dashboard']);
    //  console.log("agent",data)
      this.router.navigateByUrl(`/inventory/salesAgent/${data._id}`);
    }
  }
}
