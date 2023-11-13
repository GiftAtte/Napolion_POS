import { EmployeeComponent } from './../../employee/employee.component';
import { ModalServiceService } from './../../services/modal-service.service';
import {
  AfterViewInit,
  Component,
  ViewChild,
  Input,
  Output,
  OnInit,
  EventEmitter,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogComponent } from '../../dialog/dialog.component';
import { tap } from 'rxjs';

/** Constants used to fill up our data base. */

 interface pageInfo{
   page: number,
   pageSize: number,
 };
@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements AfterViewInit, OnInit {
  //displayedColumns: string[] = ['id', 'name', 'progress', 'fruit'];

  dataSource: MatTableDataSource<any>;
  @Input() tableTitle = '';
  @ViewChild(MatSort) sort!: MatSort;
  @Input() showToolBar = true;
  @Input() showAction = true;
  @Input() detailsAction: any;
  @Input() editAction: any;
  @Input() tableHeaders: any[] = [];
  @Input() data!: any[];
  @Input() showDetailsButton= false;
  currentPage = 1;
  totalItems = 500;
  pageSize = 30;
  constructor(
    public dialog: MatDialog,
    private modalService: ModalServiceService
  ) {
    this.dataSource = new MatTableDataSource<any>(this.data);
    console.log(this.data);
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    //  this.dataSource = new MatTableDataSource<any>(this.data);
    //  console.log(this.data);
    // this.dataSource.paginator = this.paginator;
    // //this.dataSource.sort = this.sort;
    // this.dataSource.data=this.data
    // console.log(this.data);
    // this.paginator.page
    //   .pipe(tap(()=>this.loadTableDataEmitter()))
    //   .subscribe();
    //     console.log('....', this.paginator);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  @Output()
  deleteEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  updateEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  openNewFormEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  editEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  showDetailsEvent: EventEmitter<any> = new EventEmitter<any>();

  @Input()
  loadTableDataEvent: EventEmitter<pageInfo> = new EventEmitter<pageInfo>();

  deleteAction(data: any) {
    this.deleteEvent.emit(data);
    //console.log("local Data",data)
  }
  updateAction(data: any) {
    this.updateEvent.emit(data);
  }
  // Open new/update Form
  openNewFormEmitter(data: any) {
    this.openNewFormEvent.emit(data);
  }

  // Edit Button Action
  openEditForm(data: any) {
    this.editEvent.emit(data);
  }

  // Details Button Action
  showDetailsEventEmitter(data: any) {
    this.showDetailsEvent.emit(data);
  }

  // loadTableDataEmitter() {
  //   this.loadTableDataEvent.emit({
  //     page: this.paginator?.pageIndex??0,
  //     pageSize:this.paginator?.pageSize??2
  //   })

  // }
}

/** Builds and returns a new User. */
// function createNewUser(id: number): UserData {
//   const name =
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
//     ' ' +
//     NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
//     '.';

//   return {
//     id: id.toString(),
//     name: name,
//     progress: Math.round(Math.random() * 100).toString(),
//     fruit: FRUITS[Math.round(Math.random() * (FRUITS.length - 1))],
//   };
// }
