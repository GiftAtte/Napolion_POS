import { startWith, map, Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { PriceService } from 'src/app/inventoryServices/price.service';
import { ProductService } from './../../../inventoryServices/product.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Component, Inject, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-price-form',
  templateUrl: './price-form.component.html',
  styleUrls: ['./price-form.component.scss'],
})
export class PriceFormComponent {
  priceForm!: FormGroup;
  actionBtnText = 'Update';
  isUpdate = false;
  product: any[] = [];
  productId= new FormControl("");
  selectedProduct:any
  filteredProducts: Observable<any[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
    private priceService: PriceService,
    private router: Router,
    private dialogRef: MatDialogRef<PriceFormComponent>
  ) {
    this.loadProduct();
  }


  ngOnInit() {
    // console.log(this.data)

    this.initializeForm();
    if (this.data.data) {
      this.fillForm(this.data.data);
    }

    this.filteredProducts = this.productId.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );


  }

  addPrice() {
    console.log(this.priceForm.value);
    if (this.priceForm.valid) {
      this.priceService.createPrice(this.priceForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'Price added succefully', 'success');
          this.priceForm.reset();
          this.dialogRef.close();
          this.priceService.raiseLoadEvent();
        },
        error: () => {
          alert('there was error:');
        },
      });
    }
  }
  updatePrice() {
    if (this.priceForm.valid) {
      this.priceService.putPrice(this.priceForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'price updated succefully', 'success');
          this.priceForm.reset();
          this.dialogRef.close();
          this.priceService.raiseLoadEvent();
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
  
    this.selectedProduct=data
    this.priceForm.controls['bulkPrice'].setValue(data.bulkPrice);
    this.priceForm.controls['unitPrice'].setValue(data.unitPrice);
    this.priceForm.controls['product'].setValue(data._id);
    this.priceForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
    console.log('hhhh', this.priceForm.value);
  }
  initializeForm() {
    this.priceForm = this.formBuilder.group({
      id: null,
      product: ['', Validators.required],
      unitPrice: ['', Validators.required],
      bulkPrice: ['', Validators.required],
    

      //date: ['', Validators.required],
    });
  }

  loadProduct() {
    this.priceService.getAllProduct().subscribe({
      next: (res) => {
        this.product = res.data;
        //console.log('....', this.product);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onProductChange(id:string) {
  
    let data = this.product.find(item => item._id === id)
  if(data){
    this.selectedProduct=data;
    this.priceForm.controls['id'].setValue(id);
  
  }
  }

  // filter products
  private _filter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.product.filter(option => (option.name).toLowerCase().includes(filterValue));
  }
  getProductNames(){
    return this.product.map((pro)=>pro.name)
  }
}
