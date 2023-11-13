import { TransactionService } from './../../inventoryServices/transanction.service';


import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from './../../inventoryServices/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss'],
})
export class TransactionComponent {
  tableTitle = 'User Transactions';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Transaction Type', dataKey: 'transactionType' },
    { name: 'Amount', dataKey: 'transactionAmount' },
    { name: 'Status', dataKey: 'transactionStatus', rowClass: 'text-success' },
    { name: 'Transaction Date', dataKey: 'createdAt' },
    { name: 'Invoice No', dataKey: 'invoiceNo' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private transactionService: TransactionService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getTransaction();
    this.transactionService.loadProductEvent.subscribe(() => {
      this.getTransaction();
    });
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getTransaction())).subscribe();
  }

  getTransaction() {
    this.isLoading = true;
    this.transactionService
      .getTransaction(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 100
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

  deleteTransaction(data: any) {
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
        this.transactionService.deleteTransaction(data._id).subscribe({
          next: (res) => {
            this.getTransaction();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  newTransaction(data: any) {
    this.router.navigateByUrl('/dispatch');
  }

  formatDate(data: any[]): any[] {
    const formatedData: any[] = [];
    data.forEach((element) => {
      element.createdAt = moment(element.createdAt).format('MMMM Do YYYY');
      formatedData.push(element);
    });
    return formatedData;
  }

  showDetails(data: any) {
    this.router.navigateByUrl(`transactions/${data._id}`);
  }

  updateSales(data:any){
    if(data.transactionType==="SALES"){
      this.router.navigateByUrl(`/dispatch/${data._id}`);
    }else{
      this.router.navigateByUrl(`/dispatch`);
    }
  
  }

}
