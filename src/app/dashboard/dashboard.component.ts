import { TransactionService } from './../inventoryServices/transanction.service';
import { Router } from '@angular/router';

import { EmployeeComponent } from './../employee/employee.component';

import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { ApiService } from '../services/api.service';
import { DialogComponent } from '../dialog/dialog.component';
import Swal from 'sweetalert2';
import { OutOfStockComponent } from './out-of-stock/out-of-stock.component';

interface Transaction {
  item: string;
  cost: number;
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ApiService],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  title = 'Employee';
  todaySales: number = 0;
  outOfStock:number=0
  outOftStockList:any[]=[]
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  tableHeaders: any = [
    { header: 'Txn Type', key: 'transactionType' },
    { header: 'Amount', key: 'transactionAmount' },
    { header: 'Date', key: 'createdAt', dataType: 'date' },
  ];

  data: any = [];

  constructor(

    private api: ApiService,

    private router: Router,
    private transactionService: TransactionService,
    private dialog: MatDialog,
  ) {}
  /** Gets the total cost of all transactions. */
  ngOnInit() {
    this.getAllProducts();
    this.getTransaction();
    this.getTodaySales();
    this.getOutOfStock();

  }
  ngAfterInit(): void{

  }
  openDialog() {
    this.dialog.open(EmployeeComponent, {
      width: '100%',
      data: [],
    });
  }
  getAllProducts() {
    this.api.getProducts().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.log('there was a problem tetching the products');
      },
    });
  }

  ngAfterViewInit() {
   //location.reload()
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row: any) {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Edit Product',
        row,
      },
    });
  }
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        //Swal.fire("Deleted","Product deleted successfully",'success')

        this.getAllProducts();
      },
      error: (err) => {
        alert('Error ' + err.message);
      },
    });
  }

  getTransaction() {
    this.api.getTransaction(0, 8).subscribe({
      next: (res) => {
        this.data = this.formartData(res.data);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  formartData(data: any): any[] {
    const filteredData: any[] = [];
    data.forEach((el: any) => {
      el.transactionAmount = el.transactionAmount.toFixed(2);
      filteredData.push(el);
    });

    return filteredData;
  }

  // TODAYS SALES REPORT
  getTodaySales() {
    this.transactionService.getTodaySales().subscribe({
      next: (res) => {
        this.todaySales =
          res.data.reduce(
            (sum: number, item: any) => sum + item.transactionAmount,
            0
          ) | 0.0;
      },
    });
  }

  // OUT OF STOCK
  getOutOfStock() {
    this.transactionService.getOutOfStock().subscribe({
      next: (res) => {
        let stock=res.data.filter((product: any) => product.availableQty <= 10)
       this.outOfStock = stock.length
       this.outOftStockList=stock
      },
    });
  }



  showOutOfStock() {
    let payload = {
      modalTitle: 'OUT OF STOCK LIST',
      data:this.outOftStockList
    };



    this.dialog.open(OutOfStockComponent, {
      width: '500px',
      height: 'auto',
      data: payload,
    });
  }
}









