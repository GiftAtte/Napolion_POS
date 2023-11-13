import { Router } from '@angular/router';
import { Component,Inject,OnInit} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {FormGroup,FormBuilder,Validators} from "@angular/forms"
import { ApiService } from '../services/api.service';
import { MatDialogRef } from "@angular/material/dialog"
import Swal from "sweetalert2";
export interface DialogData {
  title: string,
  // fields: [{
  //   fieldName: string,
  //   fieldType: string
  // }]
}


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit{
  freshness!: string;
  freshnessList: string[] = ['Brand New', 'Second Hand', 'Refurblished'];
  productForm!: FormGroup;
  actionBtnText = "save";
  isUpdate = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private formBuilder: FormBuilder,
    private api: ApiService,
    private dialogRef: MatDialogRef<DialogComponent>,
    
  ) { }

  ngOnInit() {

    this.productForm = this.formBuilder.group({
      id:null,
      productName: ['', Validators.required],
      category: ['', Validators.required],
      freshness: ['', Validators.required],
      price: ['', Validators.required],
      comment: ['', Validators.required],
      date:['',Validators.required]
    })


    if (this.data) {
      this.productForm.controls['productName'].setValue(this.data.row.productName)
      this.productForm.controls['category'].setValue(this.data.row.category)
      this.productForm.controls['freshness'].setValue(this.data.row.freshness)
      this.productForm.controls['price'].setValue(this.data.row.price)
      this.productForm.controls['date'].setValue(this.data.row.date)
      this.productForm.controls['comment'].setValue(this.data.row.comment)
      this.productForm.controls['id'].setValue(this.data.row.id)
      this.actionBtnText = "update";
      this.isUpdate = true;
  }

  }

  addProduct() {
    if (this.productForm.valid) {
      this.api.createProduct(this.productForm.value)
        .subscribe({
          next:(res) => {
            Swal.fire("Success","product added succefully","success");
            this.productForm.reset();
            this.dialogRef.close()
          },
          error: () => {
            alert("there was error:")
          }
        })
   }

  }
  updateProduct() {
    if (this.productForm.valid) {
      this.api.putProduct(this.productForm.value)
      .subscribe({
          next:(res) => {
            alert("product updated succefully");
            this.productForm.reset();
            this.dialogRef.close()
          },
          error: () => {
            alert("there was error:")
          }
        })
  }
  }

  getAllProducts() {
    this.api.getProducts()
      .subscribe({
        next: (res) => {
          console.log(res)
        },
        error: (err) => {
          console.log("there was a problem tetching the products")
        }
    })
  }

}
