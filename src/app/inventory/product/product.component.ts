import { CategoryService } from './../../inventoryServices/category.service';
import { ProductFormComponent } from './product-form/product-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { ProductService } from './../../inventoryServices/product.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  providers: [CategoryService],
})
export class ProductComponent {
  tableTitle = 'Product List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  category = [];
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Product Name', dataKey: 'name' },
    { name: 'Category Name', dataKey: 'categoryName' },
    { name: 'Bulk Unit', dataKey: 'bulkUnit' },
    { name: 'Bulk Qty', dataKey: 'bulkQty' },
    { name: 'Created At', dataKey: 'createdAt' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getProduct();
    this.productService.loadProductEvent.subscribe(() => {
      this.getProduct();
    });
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getProduct())).subscribe();
  }

  getProduct() {
    this.isLoading = true;
    this.productService
      .getProduct(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 500)
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

  deleteProduct(data: any) {
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
        this.productService.deleteProduct(data._id).subscribe({
          next: (res) => {
            this.getProduct();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openProductForm(data: any) {
    let payload = {
      modalTitle: 'New Product',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Product';
    }

    this.dialog.open(ProductFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }

  formatDate(data: any[]): any[] {
    const formatedData: any[] = [];
    data.forEach((element) => {
      element.createdAt = moment(element.createdAt).format('MMMM Do YYYY');
      element.categoryName = element?.category?.name;
      formatedData.push(element);
    });
    return formatedData;
  }
}
