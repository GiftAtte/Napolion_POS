import { CategoryService } from './../../inventoryServices/category.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from './../../inventoryServices/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { PriceFormComponent } from './price-form/price-form.component';
import { PriceService } from 'src/app/inventoryServices/price.service';
@Component({
  selector: 'app-price-management',
  templateUrl: './price-management.component.html',
  styleUrls: ['./price-management.component.scss'],
})
export class PriceManagementComponent {
  tableTitle = 'Price List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  category = [];
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Product Name', dataKey: 'product' },
    { name: 'Bulk Price', dataKey: 'bulkPrice' },
    { name: 'Unit Price', dataKey: 'unitPrice' },
    { name: 'Modified By', dataKey: 'updatedBy' },
    { name: 'Modified On', dataKey: 'updatedAt' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private priceService: PriceService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getPrice();
    this.priceService.loadPriceEvent.subscribe(() => {
      this.getPrice();
    });
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getPrice())).subscribe();
  }

  getPrice() {
    this.isLoading = true;
    this.priceService
      .getPrice(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 300)
      .subscribe({
        next: (res) => {
          console.log("data",res)
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

  deletePrice(data: any) {
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
        this.priceService.deletePrice(data._id).subscribe({
          next: (res) => {
            this.getPrice();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openPriceForm(data: any) {
    let payload = {
      modalTitle: 'New Price',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Price';


    this.dialog.open(PriceFormComponent, {
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
       element.updatedAt = moment(element.updatedAt).format('MMMM Do YYYY');
      element.product = element.name;
      element.productId = element._id;
      formatedData.push(element);
    });
    return formatedData;
  }
}
