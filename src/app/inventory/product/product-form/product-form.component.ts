import { ProductService } from './../../../inventoryServices/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService } from './../../../inventoryServices/category.service';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { PRODUCT_UNITS } from '../product-units';
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
})
export class ProductFormComponent {
  productForm!: FormGroup;
  actionBtnText = 'Update';
  isUpdate = false;
  category:any[]= [];
  productUnits=PRODUCT_UNITS;
  unit:number=0;
  bulkUnit=""
  showLoader=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private categoryService:CategoryService,
    private router: Router,
    private dialogRef: MatDialogRef<ProductFormComponent>
  ) {
    this.loadCategory();
  }

  @Output()
  loadProduct = new EventEmitter<any>();
  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }

  }

  addProduct() {
    //console.log(this.employeeForm.value);
    if (this.productForm.valid) {
      this.showLoader=true
      this.productService.createProduct(this.productForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Product added succefully', 'success');
          this.productForm.reset();
          this.dialogRef.close();
          this.productService.raiseLoadEvent();
          this.showLoader=false
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updateProduct() {
    if (this.productForm.valid) {
      this.productService.putProduct(this.productForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'product updated succefully', 'success');
          this.productForm.reset();
          this.dialogRef.close();
          this.productService.raiseLoadEvent();
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
    this.productForm.controls['name'].setValue(data.name);
    this.productForm.controls['category'].setValue(data.category);
    this.productForm.controls['bulkUnit'].setValue(data.bulkUnit);
    this.productForm.controls['piecesUnit'].setValue(data.piecesUnit);
    this.productForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.productForm = this.formBuilder.group({
      id: null,
      name: ['', Validators.required],
      category: ['', Validators.required],
      bulkUnit:['',Validators.required],
      piecesUnit:['',Validators.required],
      bulkQty:[0,Validators.required]


      //date: ['', Validators.required],
    });

  }

  loadCategory() {
    this.categoryService.getAllCategory().subscribe({
      next: (res) => {
        this.category = res.data;
        console.log("....",this.category)
      },
      error: (err) => {
        console.log(err);
      },
    });
  }



  setBulkUnit(event:any){
            this.bulkUnit=event.value
            console.log(event)
  }
}
