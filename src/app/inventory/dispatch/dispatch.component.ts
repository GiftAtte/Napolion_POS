import { ToastrService } from 'ngx-toastr';
import { CustomerService } from './../../inventoryServices/customer.service';
import { NgxPrintElementService } from 'ngx-print-element';
import { Order } from './Order';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { Observable, startWith, map } from 'rxjs';
import Swal  from 'sweetalert2/dist/sweetalert2.js';
import { TransactionService } from './../../inventoryServices/transanction.service';
import { DispatchFormComponent } from './dispatch-form/dispatch-form.component';

import { StockService } from './../../inventoryServices/stock.service';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { LocationStrategy, PlatformLocation } from '@angular/common';


@Component({
  selector: 'app-dispatch',
  templateUrl: './dispatch.component.html',
  styleUrls: ['./dispatch.component.scss'],
})
export class DispatchComponent implements OnInit,AfterViewInit {
  products: any[] = [];
  selectedProduct!: any;
  unitPrice = 0.0;
  bulkPrice=0.00;
  bulkUnit="";
  pieceUnit="";
  selectedUnit=""
  quantity = 0;
  maxQuantiy = 0;
  bulkQty=0;
  qtyType="BASIC"
  totalAmount = 0;
  amount: any = 0;
  isInvalidQty = false;
  details!: Order;
  orderDetails: Order[] = [];
  product = [];
  discount:any = 0.00;
  amountDue: number = 0;
  sumTotalAmount = 0;
  paymentOption = '';
  orderForm = {}
  isLoading = false;
  selectedProducts=[]
  transactionAmount=0;
  disount=0
  filteredProducts: Observable<any[]>;
  productId= new FormControl('');
  company:any;
  transactionInfo:any
  transactionId="";
  customerName:"";
  isPrint=false;
  customers:any[]=[];
  isAgent=false;
  agentId="";
  salesPersonAccountBalance=0
  salesError=false;
  isUpdate=false;
  drafts=[];
  draftId="";
  erroMsg="";
  paymentOptions = ['CASH', 'POS', 'BANK TRANSFER', 'MOBILE TRANSFER'];
  constructor(
    private stockService: StockService,
    private dialog: MatDialog,
    private salesService: TransactionService,
    private customerService:CustomerService,
    private router: Router,
    private toastStr:ToastrService,
    private activeRoute:ActivatedRoute,
    private _formBuilder:FormBuilder,
    public print: NgxPrintElementService,
    private locationStrategy: LocationStrategy,
    private platformLocation: PlatformLocation

  ) {
    this.locationStrategy.onPopState(() => {
      router.navigateByUrl(null)
    });
  }


  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = true;



  ngOnInit(): void {
    this.platformLocation.pushState(null, null, null);
    this.loadProduct();
    this.getDraft()
    this.loadCustomer();

     this.getCurrentSale();


    this.salesService.paymentOptionEvent.subscribe((res:Order) => {
      this.orderDetails= this.orderDetails.filter(
      item=>item.position!==res.position
      &&this.product.includes(res.productId
        ))
     this.orderDetails.push(res);
     this.selectedProducts=this.selectedProducts.map(prod=>{
      if(prod?.productId===res.productId){
      prod.amount=res.amount;
      prod.displayedQuantity=res.displayedQuantity
      }
      return prod
     })
  this.computeSumTotal()
     console.log("OrderDetails",this.orderDetails)
    });

// FILTER PRODUCT
this.filteredProducts = this.productId.valueChanges.pipe(
  startWith(''),
  map(value => this._filter(value || '')),
);

  }

ngAfterViewInit():void{

}


  formatData(data: any[]): any[] {
    const formatedData: any[] = [];
    data.forEach((element,index) => {
      element.productId = element._id[0]?._id;
      element.productName = element._id[0]?.name;
      element.position=index;
      element.displayedQuantity="";
      element.amount=0,
      element.bulkPrice=element._id[0]?.bulkPrice;
      element.bulkQty=element._id[0]?.bulkQty;
      element.bulkUnit=element._id[0]?.bulkUnit;
      element.piecesUnit=element._id[0]?.piecesUnit;
      element.unitPrice=element._id[0]?.unitPrice;

      formatedData.push(element);
    });

    console.log("FORMATED",formatedData)
    return formatedData;
  }



  addToCart() {


this.selectedProducts=this.product.map((element)=>this.products
                                  .find((item)=>item.productId===element))



    // if (this.quantity > 0 && this.quantity <= this.maxQuantiy) {
    //   this.isInvalidQty=false
      // let data = {
      //   quantity: this.qtyType==="BASIC"?this.quantity*this.bulkQty:this.quantity,
      //   productName: this.selectedProduct.ProductName,
      //   productId: this.selectedProduct.ProductId,
      //   unitPrice: this.qtyType==="PIECES"? this.unitPrice:this.bulkPrice,
      //   amount: this.amount,
      //   displayedQuantity:this.selectedUnit
      // };

      // this.orderDetails = this.orderDetails.filter(
      //   (item) => item.productId !== this.product
      // );
     // this.orderDetails.push(data);

      this.sumTotalAmount = this.orderDetails.reduce(
        (item, sum) => sum.amount + item,
        0
      );

    //   this.amountDue = this.sumTotalAmount

    //   this.unitPrice = 0;
    //   this.maxQuantiy = 0;
    //   this.product = [];
    //   this.amount = 0;
    //   this.quantity = 0;
    // }
  }
  removeFromCart(id: any) {
    console.log(id)
    this.selectedProducts = this.selectedProducts.filter(
      (item) => item.productId !== id
    );
     this.product=this.product.filter(item=>item!==id)
     this.orderDetails=this.orderDetails.filter(item=>item.productId!==id)
      this.computeSumTotal();
  }


  showPaymentDialog(data: any) {
    let payload = {
      modalTitle: 'Payment Options',
      data,
    };

    if (data && Object.keys(data).length) {
      payload.modalTitle = 'Update Quantities';
    }

    this.dialog.open(DispatchFormComponent, {
      width: '700px',
      height: 'auto',
      data: payload,
    });
  }
  saveOrder() {
  this.products=[]
  this.isLoading = true;
  this.stockService.getStockStats(0, 2000).subscribe({
    next: (res) => {
      this.products = this.formatData(res.data);
       if(this.product){
        if(this.checkCurrentQty(this.orderDetails)){

 
          this.orderDetails=this.selectedProducts.map(item=>this.orderDetails.find(el=>el.productId===item.productId))
      
           this.fillOrderForm()
           
              if(this.isAgent){
                const result=this.checkAgentBalance()
                if(result){
                  
                  this.saveSales();
                }else{
                  return
                }
      
              }else{
                this.saveSales();
              }
      
      

        }
          
       }
    },
  });




  }

  loadProduct() {
    this.stockService.getStockStats(0, 2000).subscribe({
      next: (res) => {
        this.products = this.formatData(res.data);
         if(this.product){
          if(this.activeRoute.snapshot.paramMap.get('id')){
            this.getSalesById(this.activeRoute.snapshot.paramMap.get('id'))
           }else  if(localStorage.getItem('orderForm')){
            this.getItemFromLocalStorage();
          }

         }
      },
    });
  }


  private _filter(value: string): any[] {
    console.log(value)
    const filterValue = value?value.toLowerCase():"";

    return this.products.filter(option => (option.productName)?.toLowerCase().includes(filterValue));
  }



  computeSumTotal(){
    this.transactionAmount=this.orderDetails.reduce((sum,item)=>sum+item.amount,0)
  }



  getCurrentSale(){
    if (this.transactionId) {
      console.log(this.transactionId)
      this.salesService.getTransactionById(this.transactionId).subscribe({
        next: (res) => {
          this.transactionInfo = res.data;
          this.company=res.company

        },
      });
    }


  }


  setCustomerType(isAgent:boolean){
         this.isAgent=isAgent
  }
  setAgent(agentId:string){
    const selectedAgent=this.customers.find(cust=>cust._id===agentId);
    this.customerName=selectedAgent.name;
    this.loadAgentAcount(agentId);
  }


  public downloadPDF(): void {
    this.isLoading = true;
    this.isPrint=true
    this.downLoad();

  }

  newTransaction() {
    this.router.navigateByUrl('/dispatch');
  }



  downLoad() {
    setTimeout(() => {
    let DATA: any = document.getElementById('invoice');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/jpeg');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 5;
      PDF.addImage(FILEURI, 'JPEG', 2, position, fileWidth, fileHeight);
      PDF.save(`SalesInvoice.pdf`);
    });
    this.isLoading = false;
  },1000)
}

// Load Sales Agents
loadCustomer() {
  this.customerService.getAllCustomer().subscribe({
    next: (res) => {
      this.customers = res.data;

    },
  });
}


getSalesById(transactionId:string){
  this.isLoading=true
    this.isUpdate=true
    this.salesService.getTransactionById(transactionId).subscribe({
      next:(res)=> {

            let productDetails:any[]=res.data?.transactionDetails
            console.log(productDetails)
           this.product=productDetails?.map(detail=>detail.productId||"");
            this.selectedProducts=productDetails
            .map(detail=>{
              console.log("details",this.products)
             let result= this.products?.find(element=>element.productId===detail.productId)

             result.amount=detail.amount;
             result.quantity=detail.quantity
             result.displayedQuantity=detail.displayedQuantity
             return result;
            })
            this.orderDetails=productDetails
            this.transactionAmount=this.selectedProducts.reduce((sum,item)=>sum+item.amount,0)
            this.isLoading=false
            this.discount=res.data.discount
            this.customerName=res.data.customerName;
            this.paymentOption=res.data.paymentOption;
            this.agentId=res.data?.salesAgent?._id


      },
    })
}


loadAgentAcount(id:string){
    this.customerService.getAccountBalance(id).subscribe({
      next:(res)=>{
        this.salesPersonAccountBalance=res.data.accountBalance
      }
    })
}


//CHECK AGENT BALANCE
checkAgentBalance():boolean{
    if(this.transactionAmount>this.salesPersonAccountBalance){
     this.salesError=true
     return false
    }
    else{
      this.salesError=false
      return true
    }
}


//SAVE  SALES INFORMATION
saveSales(){



localStorage.setItem('orderForm',JSON.stringify(this.orderForm));
if(this.draftId){
  this.deleteDraft();
}
//return
if(this.isUpdate &&this.orderDetails.length){
  this.orderForm['id']= this.activeRoute.snapshot.paramMap.get('id')
  this.orderForm['isUpdate']=true
   this.salesService.putTransaction(this.orderForm).subscribe({
     next:(res)=>{
      localStorage.removeItem('orderForm');
       this.router.navigateByUrl(`/transactions/${res.data._id}`)
     }
   })
 }
 else if(this.orderDetails.length){
     this.salesService.createTransaction(this.orderForm).subscribe({
       next: (res) => {
         this.isLoading = true;
         this.orderDetails = [];
         this.toastStr.success('Transaction completed successfully')
        // Swal.fire('Success', 'Transaction completed successfully', 'success');
         localStorage.removeItem('orderForm');
         this.router.navigateByUrl(`/transactions/${res.data._id}`)
       },
       error: (err) => {
         console.log(err);
       },
     });
   }
  }



// GET SAVED ORDER FROM LOCAL STORAGE
getItemFromLocalStorage(){
const res=JSON.parse(localStorage.getItem('orderForm'))
  this.fillTransaction(res);
}


getDraft(){
  this.salesService.getDraft().subscribe({
    next:(res)=>{
        this.drafts=res.data
        console.log(res)
    }
  })
}

saveToDraft(){
  this.isLoading=true
  this.fillOrderForm();
  this.salesService.createDraft(this.orderForm).subscribe({
    next:(res)=>{

      this.toastStr.success('Transaction saved to draft');
      this.isLoading=false
      this.orderForm={};
      this.selectedProducts=[];
      this.customerName="";
    }
  })
}


deleteDraft(){
this.salesService.deleteDraft(this.draftId).subscribe({
  next:(res)=>{
    this.orderForm={};
      this.selectedProducts=[];
      this.customerName="";
    this.getDraft()

  }
})
}

onDraftChanged(draftId:string){
const res=this.drafts.find(item=>item._id===draftId)
        this.fillTransaction(res);
}


fillTransaction(res){

  let productDetails:any[]=res.transactionDetails
  this.product=productDetails.map(detail=>detail.productId);
   this.selectedProducts=productDetails
   .map(detail=>{
    let result= this.products.find(element=>element.productId===detail.productId)

    result.amount=detail.amount;
    result.quantity=detail.quantity
    result.displayedQuantity=detail.displayedQuantity
    return result;
   })
   this.orderDetails=productDetails
   this.transactionAmount=this.selectedProducts.reduce((sum,item)=>sum+item.amount,0)
   this.isLoading=false
   this.discount=res.discount
   this.customerName=res.customerName;
   this.paymentOption=res.paymentOption;
   this.agentId=res.salesAgent?.salesAgent

}

fillOrderForm(){

  this.orderForm={
    id:"",
    transactionDetails:this.orderDetails,
    transactionAmount:this.orderDetails.reduce((sum,item)=>sum+item.amount,0),
    transactionType:"SALES",
    discountedAmount:this.orderDetails.reduce((sum,item)=>sum+item.amount,0)-this.discount,
    discount:this.discount,
    transactionStatus:"Complete",
    customerName:this.customerName,
    paymentOption:this.paymentOption,
    salesAgent:this.agentId?this.agentId:null,
     isAgent:this.isAgent
   }
}




checkCurrentQty(orderDetails:any[]) {
          
 if(this.products){
        for(let prod of orderDetails){
          console.log('produt.....',prod)
          let currentProduct=this.products.find(product=>product.productId===prod.productId);
          console.log('current',currentProduct)
          if(currentProduct?.availableQty< prod.quantity){
            this.isLoading=false;
            this.erroMsg=`The current Qty of:${prod.productName}: ${currentProduct.availableQty} is less than the required Qty: ${prod.quantity}. Please update your list`
           return false
          }
        }
      return true
      }
      return false
    }
     
    
    
  



}


