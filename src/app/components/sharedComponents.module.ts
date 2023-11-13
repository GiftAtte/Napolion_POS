import { DataPropertyGetterPipe } from './table/data-property-getter-pipe/data-property-getter-pipe.pipe';
import { CommonModule } from '@angular/common';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { DatatableComponent } from './datatable/datatable.component';
import { AppModalComponent } from './app-modal/app-modal.component';
import { MaterialComponents } from 'src/material.module';
import { PaginatorComponent } from './paginator/paginator.component';
import { TableComponent } from './table/table.component';
import { NgxPrintElementModule } from 'ngx-print-element';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SalesComponent } from '../inventory/sales/sales.component';
@NgModule({
  imports: [
    CommonModule,
    MaterialComponents,
    NgxPrintElementModule,
    NgxMatSelectSearchModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [
    DatatableComponent,
    AppModalComponent,
    PaginatorComponent,
    TableComponent,
    DataPropertyGetterPipe,
    SalesComponent,
  ],

  exports: [
    DatatableComponent,
    AppModalComponent,
    MaterialComponents,
    PaginatorComponent,
    TableComponent,
    DataPropertyGetterPipe,
    NgxMatSelectSearchModule,
    SalesComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedComponents {}
