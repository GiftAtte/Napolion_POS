//import { DatatableComponent } from './../components/datatable/datatable.component';
//import { DatatableComponent  } from './data-table.';
import { SharedComponents } from '../components/sharedComponents.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { InventoryRoutingModule } from './inventory.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { MaterialComponents } from 'src/material.module';
import { CommonModule } from '@angular/common';
import { CategoryComponent } from './category/category.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StockComponent } from './stock/stock.component';
import { StoreComponent } from './store/store.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CategoryFormComponent } from './category/category-form/category-form.component';
import { ProductFormComponent } from './product/product-form/product-form.component';
import { SupplierFormComponent } from './supplier/supplier-form/supplier-form.component';
import { CustomerComponent } from './customer/customer.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { ProductComponent } from './product/product.component';
import { StockFormComponent } from './stock/stock-form/stock-form.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { PriceManagementComponent } from './price-management/price-management.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PriceComponent } from './price/price.component';
import { PriceFormComponent } from './price-management/price-form/price-form.component';
import { DispatchFormComponent } from './dispatch/dispatch-form/dispatch-form.component';
import { TransactionDetailsComponent } from './transaction/transaction-details/transaction-details.component';
import { AgentAccountComponent } from './customer/agent-account/agent-account.component';
import { DestockComponent } from './destock/destock.component';

@NgModule({
  declarations: [
    CategoryComponent,
    SupplierComponent,
    StockComponent,
    StoreComponent,
    ProductDetailsComponent,
    CategoryFormComponent,
    ProductFormComponent,
    SupplierFormComponent,
    CustomerComponent,
    CustomerFormComponent,
    CustomerOrderComponent,
    ProductComponent,
    StockFormComponent,
    DispatchComponent,
    PriceManagementComponent,
    TransactionComponent,
    PriceComponent,
    PriceFormComponent,
    DispatchFormComponent,
    TransactionDetailsComponent,
    AgentAccountComponent,
    DestockComponent,
    // DatatableComponent
  ],
  imports: [
    CommonModule,
    InventoryRoutingModule,
    // MaterialComponents,
    FormsModule,
    ReactiveFormsModule,
    SharedComponents,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class InventoryModule {}
