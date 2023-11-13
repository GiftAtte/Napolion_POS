import { StockFormComponent } from './../stock/stock-form/stock-form.component';
import { StockService } from './../../inventoryServices/stock.service';
import { tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss'],
})
export class StoreComponent {
  tableTitle = 'Store Overview';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Product Name', dataKey: 'product' },
    { name: 'Total Qty', dataKey: 'initialQty' },
    { name: 'Quantity Sold', dataKey: 'qtySold' },
    { name: 'Available Qty', dataKey: 'availableQty' },
    { name: 'Bulk Price', dataKey: 'bulkPrice' },
    { name: 'Pieces Price', dataKey: 'unitPrice' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private stockService: StockService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getStockCount();
    this.stockService.loadStockEvent.subscribe(() => {
      this.getStockCount();
    });
  }
  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.getStockCount())).subscribe();
  }

  getStockCount() {
    this.isLoading = true;
    this.stockService
      .getStockStats(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 500
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

  deleteStock(data: any) {
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
        this.stockService.deleteStock(data._id).subscribe({
          next: (res) => {
            this.getStockCount();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openStockForm(data: any) {
    let payload = {
      modalTitle: 'New Category',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update category';


    this.dialog.open(StockFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }
  }
  formatDate(data: any[]): any[] {
    const formatedData: any[] = [];
    data.forEach((element) => {
      element.createdAt = moment(element.createdAt).format('MMMM Do YYYY');
      element.product = element._id[0]?.name;
      element.qtySold = element.qtySold * -1;
      element.bulkPrice = element?._id[0]?.bulkPrice??"Not Fixed";
      element.unitPrice = element?._id[0]?.unitPrice??"Not Fixed";
      formatedData.push(element);
    });
    return formatedData;
  }
}
