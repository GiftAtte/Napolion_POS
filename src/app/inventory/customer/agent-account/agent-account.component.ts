import { MatPaginator } from '@angular/material/paginator';
import { TransactionService } from './../../../inventoryServices/transanction.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from './../../../inventoryServices/customer.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROLES } from 'src/app/auth/Roles';
import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-agent-account',
  templateUrl: './agent-account.component.html',
  styleUrls: ['./agent-account.component.scss']
})
export class AgentAccountComponent implements OnInit {

data:any
imageSrc="../../../../assets/img/profile/profile.png"
  employeeId: any = '';
  showLoader = false;
  customerForm!: FormGroup;
  progress: number = 0;
  photo: any;
  userImage = '';
  roleList: any = ROLES;
  accountBalance=0;
  account:any[]
  tableHeaders: any[] = [
    { name: 'TXN Type', dataKey: 'transactionType' },
    { name: 'Amount', dataKey: 'transactionAmount' },
    { name: 'Transaction Date', dataKey: 'createdAt' },
    { name: 'Invoice No', dataKey: 'invoiceNo' },
  ];

  transactions:any[]=[]
  tableTitle = 'User Transactions';
  showToolBar = true;
  showAction = true;
  totalData: number = 0;
  isLoading = false;
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  constructor( private customerService:CustomerService,
                private activeRoute: ActivatedRoute,
                private formBuilder: FormBuilder,
                private transactionService:TransactionService,
                private router:Router,
                private toastsr:ToastrService
    ){

  }


ngOnInit():void{
this.loadAgent();
this.getAccountBalance();
this.initializeForm();
this.loadSalesAgentTransactions()
}


loadAgent(){
  this.customerService.getCustomerById(
     this.activeRoute.snapshot.paramMap.get('id')
  ).subscribe({
    next:(res)=>{
      this.data=res.data
      this.fillForm(res.data)
    }
  })
}


fillForm(data: any) {
  // console.log('hhhh', this.data);
  this.customerForm.controls['name'].setValue(data.name);
  this.customerForm.controls['id'].setValue(data._id);
  this.customerForm.controls['salesAgent'].setValue(data._id);

}
initializeForm() {
  this.customerForm = this.formBuilder.group({
    id:  [{value:'',disabled:true}],
    name: [{value:'',disabled:true}],
    salesAgent: [''],
    amount:[0, Validators.required],
    updateType:[0, Validators.required]

    //date: ['', Validators.required],
  });
}


getTransaction() {
  this.isLoading = true;
  this.transactionService
    .getTransaction(
      this.paginator?.pageIndex ?? 0,
      this.paginator?.pageSize ?? 15
    )
    .subscribe({
      next: (res) => {
        this.data = this.formatDate(res.data);
        this.totalData = res.length;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
}

deleteTransaction(data: any) {
  Swal.fire({
    title: 'Are you sure want to remove?',
    text: 'You will not be able to recover this file!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ok',
    cancelButtonText: 'cancel',
    cancelButtonColor: 'green',
    confirmButtonColor: 'red',
  }).then((result) => {
    if (result.value) {
      this.transactionService.deleteTransaction(data._id).subscribe({
        next: (res) => {
          this.getTransaction();
          Swal.fire('Deleted!', ' Deleted Successfully', 'success');
        },
        error: (err) => {
          Swal.fire('Erro', err.message, 'error');
        },
      });
    }
  });
}

newTransaction(data: any) {
  this.router.navigateByUrl('/dispatch');
}


formatDate(data: any[]): any[] {
  const formatedData: any[] = [];
  data.forEach((element) => {
    element.createdAt = moment(element.createdAt).format('MMMM Do YYYY');
    formatedData.push(element);
  });
  return formatedData;
}


showDetails(data: any) {
  this.router.navigateByUrl(`transactions/${data._id}`);
}

loadSalesAgentTransactions(){
   this.transactionService
   .getCustomerTranactions(this.activeRoute.snapshot.paramMap.get('id'))
   .subscribe({
    next:(res)=>{
      this.transactions=this.formatDate(res.data);
    }
   })
}

getAccountBalance(){
  this.customerService.getAccountBalance(this.activeRoute.snapshot.paramMap.get('id')).subscribe({
    next:(res)=>{
      this.accountBalance=res.data.accountBalance;
      this.account=res.data.account
    }
  })
}

// GOTO TO PURCHASE DETAILS
navigateTransaction(id:string){
  this.router.navigateByUrl(`/inventory/transactions/${id}`)
}

// UPDATE ACCOUNT
updateAgentAccount(){
  this.showLoader=true
     this.customerService.updateAgentAccount(this.customerForm.value).subscribe({
       next:(res)=>{
        this.showLoader=false
           this.toastsr.success('Account updated successfully')
        this.getAccountBalance()
       }
     })

}

}
