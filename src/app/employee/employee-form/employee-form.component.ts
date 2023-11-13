import { Designation } from './designation';
import { map, Observable, startWith } from 'rxjs';
import { Component,Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormBuilder,Validators, FormControl} from "@angular/forms"
import { MatDialogRef } from "@angular/material/dialog"
import { EmployeeService } from 'src/app/services/employee.service';
import {AppService } from 'src/app/services/app.service';
import {DEPARTMENT} from "../department"
import Swal from "sweetalert2";

export interface DialogData {
  title: string,
}

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss'],
  providers:[EmployeeService]
})
export class EmployeeFormComponent {
  employeeForm!: FormGroup;
  actionBtnText = 'save';
  isUpdate = false;
  department:any[] = [];
  showLoader=false
  options: string[] = Designation;
  filteredDesignation: Observable<string[]>;
  designation = new FormControl('');

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private empService: EmployeeService,
    private appService:AppService,
    private dialogRef: MatDialogRef<EmployeeFormComponent>
  ) {}

  ngOnInit() {
   // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }

    this.loadDepartment();
    this.filteredDesignation = this.designation.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  addEmployee() {
   // console.log(this.designation.value);
    this.employeeForm.controls['designation'].setValue(this.designation.value);
    if (this.employeeForm.valid) {
      this.showLoader=true
      this.empService.createEmployees(this.employeeForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', `employee added succefully.
           \n Your current password:${res.loginDetails.pass}`, 'success');
          this.employeeForm.reset();
          this.showLoader=false
          this.dialogRef.close();
          this.appService.loadEventEmitter(null)
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateEmployee() {

    this.employeeForm.controls["designation"].setValue(this.designation.value)
    if (this.employeeForm.valid) {
       this.showLoader = true;
      this.empService.putEmployees(this.employeeForm.value).subscribe({
        next: (res) => {
         Swal.fire('Success', 'employee updated succefully', 'success');
          this.employeeForm.reset();
          this.dialogRef.close();
          this.appService.loadEventEmitter(null);
           this.showLoader = false;
        },
        error: () => {
          alert('there was error:');
           this.showLoader = false;
        },
      });
    } else {
      console.log(this.employeeForm)
    }
  }



  fillForm(data: any) {
  // console.log("hhhh",this.data)
      this.employeeForm.controls['surname'].setValue(data.surname);
      this.employeeForm.controls['firstName'].setValue(data.firstName);
      this.employeeForm.controls['gender'].setValue(data.gender);
      this.employeeForm.controls['phone'].setValue(data.phone);
      this.employeeForm.controls['designation'].setValue(data.designation);
      this.employeeForm.controls['department'].setValue(this.data.department);
      this.employeeForm.controls['id'].setValue(data._id);
      this.actionBtnText = 'update';
      this.isUpdate = true;

  }
  initializeForm() {
   this.employeeForm = this.formBuilder.group({
     id: null,
     firstName: ['', Validators.required],
     surname: ['', Validators.required],
     phone: ['', Validators.required],
     gender: ['', Validators.required],
     department: ['', Validators.required],
     designation: ['', Validators.required],
     //date: ['', Validators.required],
   });
  }

  loadDepartment() {
    this.appService.getDepartment(0,25).subscribe({
      next: (res) => {
         this.department=res.data
      }
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
}






