import { SupplierService } from './../../../inventoryServices/supplier.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { listItems, settings } from './listItems';
@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss'],
})
export class SupplierFormComponent {
  dropdownList = listItems;
  selectedItems:any = [];
  dropdownSettings = settings;

  supplierForm!: FormGroup;
  actionBtnText = 'Update';
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private supplierService: SupplierService,
    private dialogRef: MatDialogRef<SupplierFormComponent>
  ) {}

 
  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }

    
  }

  addSupplier() {
    //console.log(this.employeeForm.value);
    if (this.supplierForm.valid) {
      this.supplierService.createSupplier(this.supplierForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'supplier added succefully', 'success');
          this.supplierForm.reset();
          this.dialogRef.close();
          this.supplierService.raiseLoadEvent();
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateSupplier() {
    if (this.supplierForm.valid) {
      this.supplierService.putSupplier(this.supplierForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category updated succefully', 'success');
          this.supplierForm.reset();
          this.dialogRef.close();
          this.supplierService.raiseLoadEvent();
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
    this.supplierForm.controls['name'].setValue(data.name);
    this.supplierForm.controls['phoneNumber'].setValue(data.phoneNumber);
    this.supplierForm.controls['email'].setValue(data.email);
    this.supplierForm.controls['address'].setValue(data.address);
    this.supplierForm.controls['id'].setValue(data._id);
     this.supplierForm.controls['products'].setValue(data.procucts);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.supplierForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      phoneNumber: [''],
      email: ['', Validators.required],
      products:['',Validators.required],
      address: [''],

      //date: ['', Validators.required],
    });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }
}
