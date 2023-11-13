import { CustomerService } from './../../../inventoryServices/customer.service';
import { TransactionService } from './../../../inventoryServices/transanction.service';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, Inject } from '@angular/core';
import { Order } from '../Order';

@Component({
  selector: 'app-dispatch-form',
  templateUrl: './dispatch-form.component.html',
  styleUrls: ['./dispatch-form.component.scss'],
})
export class DispatchFormComponent {
  actionBtnText = 'Update';
  isUpdate = false;
  paymentOptions = ['CASH', 'POS', 'BANK TRANSFER', 'MOBILE TRANSFER'];
  paymentOption = '';
  customers: any[] = [];
  amount=0;
  quantity = 1;
  product:any
  unitPrice:0;
  quantityUnit=""
  quantityErr=false;
  salesInfo:Order
  errorMessage=""
  tempQuntity=1
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private salesService: TransactionService,
    private customerService: CustomerService,
    private router: Router,
    private dialogRef: MatDialogRef<DispatchFormComponent>
  ) {}

  ngOnInit() {
    this.loadCustomer();
   this.product=this.data.data

this.salesInfo={
  unitPrice:this.unitPrice,
  quantity:this.tempQuntity,
  amount: this.amount,
  productName: this.product.productName,
  productId: this.product.productId,
  position:this.product.index,
  displayedQuantity:""
}

  }
  updateProduct() {}

  optionEmitter() {
    if(this.quantityUnit!=="HALF"){
      this.computAmount();
    }



    if (this.amount>0 && !this.quantityErr) {

  this.salesInfo.unitPrice=this.unitPrice,
  this.salesInfo.quantity=this.tempQuntity,
  this.salesInfo.amount= this.amount,
  this.salesInfo.productName= this.product.productName,
  this.salesInfo.productId= this.product.productId,
  this.salesInfo.position=this.product.position
  this.salesService.postOption(this.salesInfo);
  this.dialogRef.close();
      }

  }
  loadCustomer() {
    this.customerService.getAllCustomer().subscribe({
      next: (res) => {
        this.customers = res.data;
      },
    });
  }


onQuantityChange(){

this.computAmount()
}
onUnitChange(value:any){
  console.log(value)
  if(value==="BULK"){
    this.quantity=this.product.bulkQty
  }
  else if(value==="HALF"){
this.quantity=this.product.bulkQty/2;
  }
  else{
    this.quantity=1
  }
   this.computAmount();
   this.quantity=1
  // this.onQuantityChange()
}

computAmount(){
  if(this.quantityUnit==="BULK"){
    this.tempQuntity=this.quantity*this.product.bulkQty
  }else if(this.quantityUnit==="HALF"){
    this.tempQuntity=this.product.bulkQty/2;
  }else{
    this.tempQuntity=this.quantity
  }


  if(this.tempQuntity>this.product.availableQty){
    this.quantityErr=true
    this.errorMessage=`Sorry, the required quantity is greater than available quantity `
 }else if(this.tempQuntity===0){
   this.errorMessage=`Sorry, required quantity can not be 0`
   this.quantityErr=true
 }else{
   this.quantityErr=false;
   this.errorMessage=""
 }

 switch (this.quantityUnit) {
   case "BULK":
     this.amount=this.product.bulkPrice*this.quantity
     this.salesInfo.displayedQuantity=`${this.quantity}${this.product.bulkUnit}`
     this.unitPrice=this.product.bulkPrice
     break;
    case "HALF":
     this.amount=this.product.bulkPrice/2
     this.quantity=this.product.bulkQty/2
     this.salesInfo.displayedQuantity=`1/2${this.product.bulkUnit}`
     this.unitPrice=this.product.bulkPrice
     break;
   default:
     this.amount=this.product.unitPrice*this.quantity
     this.salesInfo.displayedQuantity=`${this.quantity}${this.product.piecesUnit}`
     this.unitPrice=this.product.unitPrice;
     break;
 }



}


getCurrentStock(){

}




 
ngAfterInit():void{
  this.computAmount()
}
}
