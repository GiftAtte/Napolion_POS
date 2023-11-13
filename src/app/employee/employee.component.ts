import { map } from 'rxjs';
import { AppService } from 'src/app/services/app.service';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmployeeFormComponent } from './employee-form/employee-form.component';
import { EmployeeService } from '../services/employee.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
  providers: [],
})
export class EmployeeComponent {
  tableTitle = 'Employee List';
  showToolBar = true;
  showAction = true;
  isLoading = false;
  totalData = 0;
  row: any;
  data = [];
  tableHeaders: any[] = [
    { name: 'Photo', dataKey: 'img',isImage:true },
    { name: 'Surname', dataKey: 'surname' },
    { name: 'First Name', dataKey: 'firstName' },
    { name: 'Phone Number', dataKey: 'phone' },
    { name: 'Employee Number', dataKey: 'empNo' },
    { name: 'Designation', dataKey: 'designation' },
  ];
  totalCount = 0;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private employeeService: EmployeeService,
    private appService: AppService,
    private router: Router //private infoService: InfoService
  ) {
    this.getEmployee();
  }
  ngOnInit(): void {
    this.appService.loadAppEvent.subscribe(() => {
      this.getEmployee();
    });
  }

  getEmployee() {
    this.isLoading = true;
    this.employeeService
      .getPEmployees(
        this.paginator?.pageIndex ?? 0,
        this.paginator?.pageSize ?? 25
      )
      .subscribe({
        next: (res) => {
          this.data = this.formartData(res.data);
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
  updateEmployee(data: any) {}

  deleteEmployee(data: any) {
    console.log(data);
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
        this.employeeService.deleteEmployees(data._id).subscribe({
          next: (res) => {
            this.getEmployee();
            Swal.fire('Deleted!', ' Deleted Successfully', 'success');
          },
          error: (err) => {
            Swal.fire('Erro', err.message, 'error');
          },
        });
      }
    });
  }

  openEmployeeForm(data: any) {
    let payload = {
      modalTitle: 'New Employee',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Employee';
    }

    this.dialog.open(EmployeeFormComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }
  gotoProfile(data: any) {
    if (data?._id) {
      // this.router.navigate(['dashboard']);
      console.log(data)
      this.router.navigateByUrl(`employees/profile/${data._id}`);
    }
  }


  formartData(data:any){
    return data.map(item=>{
  item.img=`../../assets/img/profile/${item.user?.photo??'profile.png'}`
      return item

    })
  }
}
