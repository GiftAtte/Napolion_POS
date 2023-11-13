import { AuthService } from './../../auth/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { TableColumn } from './table-column';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgxPrintElementService } from 'ngx-print-element';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  public tableDataSource: MatTableDataSource<any> =
    new MatTableDataSource<any>();
  public displayedColumns!: string[];
  @ViewChild(MatPaginator, { static: false }) matPaginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) matSort!: MatSort;

  @Input() isPageable = false;
  @Input() showDetailsButton = false;
  @Input() showDeleteBtn = true;
  @Input() showEditBtn = true;
  @Input() showCustomActionBtn = false;
  @Input() isSortable = false;
  @Input() isFilterable = false;
  @Input() showToolBar = true;
  @Input() tableTitle = '';
  @Input() isLoading = false;
  @Input() showAction = true;
  @Input() tableColumns!: TableColumn[];
  @Input() rowClass=""
  @Input() customEventBtnIcon;
  @Input() rowActionIcon: string = 'action';
  @Output() sort: EventEmitter<Sort> = new EventEmitter();
  @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  openNewFormEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  deleteEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  updateEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  editEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  showDetailsEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output()
  linkEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  pdfDownloadEvent: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  printEvent: EventEmitter<any> = new EventEmitter<any>();


  @Output()
  customEvent: EventEmitter<any> = new EventEmitter<any>();

  // this property needs to have a setter, to dynamically get changes from parent component
  @Input() set tableData(data: any[]) {
    this.setTableDataSource(data);
  }

  constructor(public print: NgxPrintElementService,
    public gate: AuthService
    ) {}

  ngOnInit(): void {
    const columnNames = this.tableColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    if (this.showAction) {
      this.displayedColumns = ["rowCount",...columnNames, this.rowActionIcon];
    } else {
      this.displayedColumns = columnNames;
    }
  }

  // we need this, in order to make pagination work with *ngIf
  ngAfterViewInit(): void {
    this.tableDataSource.paginator = this.matPaginator;
  }

  setTableDataSource(data: any) {
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.matPaginator;
    this.tableDataSource.sort = this.matSort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableDataSource.filter = filterValue.trim().toLowerCase();
  }

  sortTable(sortParameters: Sort) {
    // defining name of data property, to sort by, instead of column name
    // sortParameters.active = this.tableColumns.find(
    //   (column) => column.name === sortParameters.active
    // ).dataKey;
    // this.sort.emit(sortParameters);
  }

  emitRowAction(row: any) {
    this.rowAction.emit(row);
  }
  openNewFormEmitter(data: any) {
    this.openNewFormEvent.emit(data);
  }
  deleteAction(data: any) {
    this.deleteEvent.emit(data);
    //console.log("local Data",data)
  }
  updateAction(data: any) {
    this.updateEvent.emit(data);
  }
  // Edit Button Action
  openEditForm(data: any) {
    this.editEvent.emit(data);
  }

  // Details Button Action
  showDetailsEventEmitter(data: any) {
    this.showDetailsEvent.emit(data);
  }

  linkEventEmitter(data: any) {
    console.log(data);
    this.linkEvent.emit(data);
  }

  printDoc() {
    this.printEvent.emit();
  }

fireCustomEvent(data:any){
  this.customEvent.emit(data)
}


  public downlodPDF(): void {
    this.isLoading=true
    let DATA: any = document.getElementById('tableData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/jpeg');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 5;
      PDF.addImage(FILEURI, 'JPEG', 2, position, fileWidth, fileHeight);
      PDF.save(`${this.tableTitle}.pdf`);
    });
    this.isLoading = false;
  }
}
