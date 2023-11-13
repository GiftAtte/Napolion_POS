import { StockService } from './../../inventoryServices/stock.service';
import { StockFormComponent } from './stock-form/stock-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from './../../inventoryServices/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss'],
})
export class StockComponent implements OnInit, AfterViewInit {
  tableTitle = 'Stock Update';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  category = [];
  data: any[] = [];
  destock=false
  tableHeaders: any[] = [
    { name: 'Product Name', dataKey: 'product' },
    { name: 'Update Type', dataKey: 'updateType' },
    { name: 'Quantity', dataKey: 'displayQty' },
    { name: 'UpatedBy', dataKey: 'userName', isLink: true },
    { name: 'Destock Reason', dataKey: 'destockReason', isLink: true },
    { name: 'Transaction Date', dataKey: 'createdAt' },

  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private stockService: StockService,

    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {

    this.productService.loadProductEvent.subscribe(() => {
      // this.isLoading=false
      this.getStock();
    });
   this.getStock()
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getStock())).subscribe();
  }

  getStock() {
    this.isLoading = true;
    this.stockService
      .getStock(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 500)
      .subscribe({
        next: (res) => {

         //let resData=  res.data;
       this.data= this.formatDate(res)
          this.totalData = res.data.length;

          this.isLoading = false;
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
// Delete Stock
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
            this.getStock();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }


// Open Dialog
  openStockForm(data: any) {
    let payload = {
      modalTitle: 'New Product',
      data,
    };



    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Stock';
    }
    this.dialog.open(StockFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }


  //Fomat Data
  formatDate(data: any): any[] {

    let formatedData: any[] = [];
    formatedData= data.data.map((element:any) => {
      console.log(element)
      const product={
        _id:element._id,
        product:element?.product?.name,
        productId:element?.product?._id,
        quantity:element?.quantity,
        supplier:element?.supplier?.name,
        supplierId:element?.supplier?._id,
        userName:element?.userName,
        displayQty:element?.displayQty,
        updateType:element?.updateType,
        destockReason:element?.destockReason,
        createdAt:moment(element.createdAt).format('MMMM Do YYYY')
      };

        return product
    });
    return formatedData.filter(item=>item.quantity>=0||item.updateType==="DESTOCK");
  }

  gotoProfile(data: any) {
    this.router.navigateByUrl(`employees/profile/${data._id}`)
  }


  // DESTOCK

  destockProduct(){

    this.destock=true


    let payload = {
      modalTitle: 'Destock Product',
      destock:true,

    };
    this.dialog.open(StockFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }
}
