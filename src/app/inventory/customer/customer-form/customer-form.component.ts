import Swal from 'sweetalert2/dist/sweetalert2.js';
import { CustomerService } from './../../../inventoryServices/customer.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss'],
})
export class CustomerFormComponent {
  customerForm!: FormGroup;
  actionBtnText = 'Update';
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerFormComponent>
  ) {}

  @Output()
  loadCategory = new EventEmitter<any>();
  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }
  }

  addCustomer() {
    //console.log(this.employeeForm.value);
    if (this.customerForm.valid) {
      this.customerService.createCustomer(this.customerForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category added succefully', 'success');
          this.customerForm.reset();
          this.dialogRef.close();
          this.customerService.raiseLoadEvent();
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateCustomer() {
    if (this.customerForm.valid) {
      this.customerService.putCustomer(this.customerForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category updated succefully', 'success');
          this.customerForm.reset();
          this.dialogRef.close();
          this.customerService.raiseLoadEvent();
        },
        error: () => {
          alert('there was error:');
        },
      });
    } else {
      //console.log(this.categoryForm);
    }
  }

  fillForm(data: any) {
    // console.log('hhhh', this.data);
    this.customerForm.controls['name'].setValue(data.name);
    this.customerForm.controls['phoneNumber'].setValue(data.phoneNumber);
    this.customerForm.controls['email'].setValue(data.email);
    this.customerForm.controls['address'].setValue(data.address);
    this.customerForm.controls['accountLimit'].setValue(data.accountLimit);
    this.customerForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.customerForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      phoneNumber: [''],
      email: ['', Validators.required],
      address: [''],
      accountLimit: [0,Validators.required],

      //date: ['', Validators.required],
    });
  }
}


