import Swal from 'sweetalert2/dist/sweetalert2.js';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from './../../services/app.service';
import { Component, Inject } from '@angular/core';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.scss'],
})
export class DepartmentFormComponent {
  departmentForm!: FormGroup;
  actionBtnText = 'save';
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private dialogRef: MatDialogRef<DepartmentFormComponent>
  ) {}

  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }
  }

  addDepartment() {
    //console.log(this.employeeForm.value);
    if (this.departmentForm.valid) {
      this.appService.createDepartment(this.departmentForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'settings added succefully', 'success');
          this.departmentForm.reset();
          this.dialogRef.close();
          this.appService.loadEventEmitter(null);
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateDepartment() {
    console.log(this.departmentForm.value);
    if (this.departmentForm.valid) {
      this.appService.putDepartment(this.departmentForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'department updated succefully', 'success');
          this.departmentForm.reset();
          this.dialogRef.close();
          this.appService.loadEventEmitter(null)
          
        },
        error: () => {
          alert('there was error:');
        },
      });
    } else {
    }
  }

  fillForm(data: any) {
    // console.log("hhhh",this.data)
    this.departmentForm.controls['name'].setValue(data.name);
    this.departmentForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.departmentForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
    });
  }
}






