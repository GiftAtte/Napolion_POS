import { SettingsFormComponent } from './settings-form/settings-form.component';
import { tap } from 'rxjs';
import { Router } from '@angular/router';
import { AppService } from './../services/app.service';
import  Swal  from 'sweetalert2/dist/sweetalert2.js';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  tableTitle = 'Company List';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  row: any;
  category = [];
  data: any[] = [];
  tableHeaders: any[] = [
    { name: 'Company Name', dataKey: 'companyName' },
    { name: 'Phone', dataKey: 'phone' },
    { name: 'Email', dataKey: 'email' },
    { name: 'Created At', dataKey: 'createdAt' },
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private appService: AppService,
    private router: Router //private infoService: InfoService
  ) {}

  ngOnInit() {
    this.getSettings();
    this.appService.loadAppEvent.subscribe(() => {
      this.getSettings();
    });
  }
  ngAfterViewInit(): void {
    this.paginator?.page.pipe(tap(() => this.getSettings())).subscribe();
  }

  getSettings() {
    this.isLoading = true;
    this.appService
      .getApp(this.paginator?.pageIndex ?? 0, this.paginator?.pageSize ?? 5)
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

  deleteApp(data: any) {
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
        this.appService.deleteApp(data._id).subscribe({
          next: (res) => {
            this.getSettings();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openAppForm(data: any) {
    let payload = {
      modalTitle: 'New App Settings',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Setting';
    }

    this.dialog.open(SettingsFormComponent, {
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
