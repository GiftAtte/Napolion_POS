import { Observable, startWith, map } from 'rxjs';
import { SupplierService } from './../../../inventoryServices/supplier.service';
import { StockService } from './../../../inventoryServices/stock.service';
import { ProductService } from './../../../inventoryServices/product.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Component, Inject} from '@angular/core';


@Component({
  selector: 'app-stock-form',
  templateUrl: './stock-form.component.html',
  styleUrls: ['./stock-form.component.scss'],
})
export class StockFormComponent {
  stockForm!: FormGroup;
  actionBtnText = 'Update';
  isLoading=false
  isUpdate = false;
  suppliers: any[] = [];
  products: any[] = [];
  selectedProduct:any
  filteredProducts: Observable<any[]>;
  productId= new FormControl('');
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private productService: ProductService,
     private supplierService: SupplierService,
    private stockService: StockService,
    private dialogRef: MatDialogRef<StockFormComponent>
  ) {
    this.loadProduct();
    this.loadSupplier()
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

  addStock() {
    this.isLoading=true
    if (this.stockForm.valid) {

     let stockData=this.stockForm.value;
       stockData.quantity=stockData.stockUnit===this.selectedProduct.bulkUnit?
                          stockData.unitQty*this.selectedProduct.bulkQty
                          :stockData.unitQty
        stockData.displayQty=`${stockData.unitQty}${stockData.stockUnit}`

        if(this.data.destock){
          stockData.updateType="DESTOCK"
          stockData.quantity=stockData.quantity*-1
          stockData.displayQty=`-${stockData.displayQty}`
        }

      this.stockService.createStock(stockData).subscribe({
        next: (res) => {
          Swal.fire('Success', 'stock added succefully', 'success');
          this.stockForm.reset();
          this.dialogRef.close();
          this.isLoading=false
          this.productService.raiseLoadEvent();
        },
        error: () => {
          this.isLoading=false
          alert('there was error:');
        },
      });
    }
  }
  updateStock() {
    if (this.stockForm.valid) {
      this.stockService.putStock(this.stockForm.value).subscribe({
        next: (res) => {
          Swal.fire('Success', 'category updated succefully', 'success');
          this.stockForm.reset();
          this.dialogRef.close();
          this.stockService.raiseLoadEvent();
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
    console.log("data",data)
    this.stockForm.controls['product'].setValue(data.productId);
    this.stockForm.controls['supplier'].setValue(data.supplierId);
    this.stockForm.controls['costPrice'].setValue(data.costPrice);
    this.stockForm.controls['stockUnit'].setValue(data.stockUnit)
    this.stockForm.controls['id'].setValue(data._id);
    this.actionBtnText = 'update';
    this.isUpdate = true;
  }
  initializeForm() {
    this.stockForm = this.formBuilder.group({
      id: null,
      product: ['', Validators.required],
      supplier: [''],
      costPrice: [0.00],
      stockUnit:['',Validators.required],
      unitQty:[0,Validators.required],
      destockReason:[""]
      //date: ['', Validators.required],
    });
  }

  loadProduct() {
    this.productService.getAllProduct().subscribe({
      next: (res) => {
        this.products = res.data;
        // console.log('product', res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  loadSupplier() {
    this.supplierService.getAllSupplier().subscribe({
      next: (res) => {
        this.suppliers = res.data.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onProductChange(productId:string){
    this.selectedProduct=this.products.find((product)=>product._id===productId)
    console.log(this.selectedProduct)
  }

  private _filter(value: string): any[] {
    console.log(value)
    const filterValue = value?value.toLowerCase():"";

    return this.products.filter(option => (option.name)?.toLowerCase().includes(filterValue));
  }

}
