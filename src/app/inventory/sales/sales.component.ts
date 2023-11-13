import { FormControl, Validators } from '@angular/forms';

import { FormBuilder,FormGroup } from '@angular/forms';
import { TransactionService } from './../../inventoryServices/transanction.service';
import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, Input } from '@angular/core';
import * as moment from "moment"

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit, AfterViewInit {
  sales: any[] = [];
  datesObj:FormGroup
  // datesObj=new FormGroup({
  //   start: new FormControl<Date | null>(null),
  //   end: new FormControl<Date | null>(null),
  // });
  public totalCount = 0;
  public pageIndex = 0;
  public pageSize = 10;
  startDate=new Date();
  endDate=new Date();
  totalSale: number = 0;
  isLoading=false
  @Input()
  employeeId="";
  @ViewChild('uiElement', { static: false })
  public uiElement!: ElementRef;

  constructor(
    private transactionService: TransactionService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    // this.startDate = this.datesObj.value.startDate;
    // this.endDate = this.datesObj.value.endDate;
    // this.loadSalesByDates()
    this.getTRansactions(null);
  }

  ngAfterViewInit(): void {
    
    
  }

  initializeForm() {
    this.datesObj = this.formBuilder.group({
      startDate: [new Date(), Validators.required],
      endDate: [new Date(), Validators.required],
    });
  }

  loadSalesByDates(startDate: any, endDate: any) {
    this.transactionService.getSales({ startDate, endDate,employeeId:this.employeeId }).subscribe({
      next: (res) => {
        this.sales = res.data;
      },
    });
  }

  getTRansactions(event) {
 if(event){
  this.endDate=event.value
 }
 
      this.isLoading = true;
      this.transactionService
        .getSales({
          startDate: moment(this.startDate).startOf('date'),
          endDate: moment(this.endDate).endOf("date"),
          employeeId:this.employeeId
        })
        .subscribe({
          next: (res) => {
            this.sales = res.data;
            if(this.sales.length){
              this.totalSale = this.sales
              .reduce((sum, item) => sum + item.transactionAmount, 0)
              .toFixed(2);
            }
            this.isLoading = false;
          },
        });
    
  }
  public async onScrollLoadData() {
    const nativeElement = this.uiElement.nativeElement;
    console.log(this.uiElement);
    if (
      nativeElement.clientHeight + Math.round(nativeElement.scrollTop) ===
        nativeElement.scrollHeight &&
      this.sales.length !== this.totalCount
    ) {
      this.transactionService
        .getTransaction(this.pageIndex, this.pageSize)
        .subscribe({
          next: (res) => {
            this.sales = [...this.sales, ...res.data];
          },
        });
      this.pageIndex += 1;
      // nativeElement.scrollTop=0;
    }
  }

  setStartDate(event){
this.startDate=event.value
  }
}
