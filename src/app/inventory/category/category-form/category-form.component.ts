import { Router } from '@angular/router';
import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from './../../../inventoryServices/category.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent {
  categoryForm!: FormGroup;
  actionBtnText = "Update";
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router:Router,
    private dialogRef: MatDialogRef<CategoryFormComponent>
  ) {}

@Output()
loadCategory=new EventEmitter<any>()
  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }
  }

  addCategory() {
    //console.log(this.employeeForm.value);
    if (this.categoryForm.valid) {
      this.categoryService.createCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category added succefully', 'success');
          this.categoryForm.reset();
          this.dialogRef.close();
          this.categoryService.raiseLoadEvent()
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateCategory() {
    if (this.categoryForm.valid) {
      this.categoryService.putCategory(this.categoryForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category updated succefully', 'success');
          this.categoryForm.reset();
          this.dialogRef.close();
          this.categoryService.raiseLoadEvent();
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
    this.categoryForm.controls['name'].setValue(data.name);
    this.categoryForm.controls['id'].setValue(data._id)
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.categoryForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],

      //date: ['', Validators.required],
    });
  }
}


