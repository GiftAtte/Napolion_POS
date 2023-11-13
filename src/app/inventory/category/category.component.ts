import { tap } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryFormComponent } from './category-form/category-form.component';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { CategoryService } from './../../inventoryServices/category.service';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import * as moment from 'moment';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements AfterViewInit {
  tableTitle = 'Category List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Name', dataKey: 'name', isLink: true },
    { name: 'Created At', dataKey: 'createdAt', isLink: false },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getCategory();
    this.categoryService.loadCategorEvent.subscribe(() => {
      this.getCategory();
    });
  }
  ngAfterViewInit(): void {
    this.paginator.page.pipe(tap(() => this.getCategory())).subscribe();
  }

  getCategory() {
    this.isLoading = true;
    this.categoryService
      .getCategory(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 50
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

  deleteCategory(data: any) {
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
        this.categoryService.deleteCategory(data._id).subscribe({
          next: (res) => {
            this.getCategory();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openCategoryForm(data: any) {
    let payload = {
      modalTitle: 'New Category',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update category';
    }

    this.dialog.open(CategoryFormComponent, {
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
