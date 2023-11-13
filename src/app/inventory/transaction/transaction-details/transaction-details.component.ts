import { TransactionService } from './../../../inventoryServices/transanction.service';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { NgxPrintElementService } from 'ngx-print-element';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import numToWord from "../../../numToWord"
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss'],
})
export class TransactionDetailsComponent implements OnInit,AfterViewInit {
  transactionId!: any;
  data!: any;
  isLoading = false;
  isPrint = false;
  company!:any
  isPrinted=false
  amountInWord=""
  public numberToWord=numToWord
  @Input()Id=""
  constructor(
    private activeRoute: ActivatedRoute,
    private transactionService: TransactionService,
    public gate:AuthService,
    public print: NgxPrintElementService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.transactionId = this.activeRoute.snapshot.paramMap.get('id')||this.Id;
    console.log("transaction ID",this.transactionId);
      if (this.transactionId) {
        console.log(this.transactionId)
        this.transactionService.getTransactionById(this.transactionId).subscribe({
          next: (res) => {
            this.data = res.data;
            this.amountInWord= `${this.numberToWord(Math.round(res.data.discountedAmount))} naira`
            this.company=res.company
              if(this.data.isPrinted && !this.gate.isAdmin()){
                this.isPrinted=true
                this.router.navigateByUrl('/inventory/dispatch');
              }

          },
        });
      }
  }

ngAfterViewInit():void{

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

printInvoice(print:any){
this.data.isPrinted=true
this.data.id=this.data._id
this.data.isUpdate=true
this.isPrinted=true

this.transactionService.putTransaction(this.data).subscribe({
  next:(res)=>{
    this.router.navigateByUrl('/inventory/dispatch');
  }
})

}


}
