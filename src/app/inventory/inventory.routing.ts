
import { AuthGuardService } from './../auth/auth-guard.service';
import { canActivate } from './../auth/auth.service';
import { SalesComponent } from './sales/sales.component';
import { TransactionDetailsComponent } from './transaction/transaction-details/transaction-details.component';
import { TransactionComponent } from './transaction/transaction.component';
import { PriceManagementComponent } from './price-management/price-management.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { SupplierComponent } from './supplier/supplier.component';
import { CustomerOrderComponent } from './customer-order/customer-order.component';
import { CustomerComponent } from './customer/customer.component';
import { CategoryComponent } from './category/category.component';
import { StoreComponent } from './store/store.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { StockComponent } from './stock/stock.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { ProductComponent } from './product/product.component';
import { permissions } from '../auth/Roles';
import { AgentAccountComponent } from './customer/agent-account/agent-account.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'stock', component: StockComponent ,
  canActivate:[AuthGuardService,()=>canActivate(permissions.admin)] 
},
  { path: 'products', component: ProductComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'store', component: StoreComponent },
  { path: 'category', component: CategoryComponent },
  { path: 'customers', component: CustomerComponent },
  { path: 'orders', component: CustomerOrderComponent },
  { path: 'dispatch', component: DispatchComponent },
  { path: 'dispatch/:id', component: DispatchComponent },
  { path: 'transactions', component: TransactionComponent,
  canActivate:[AuthGuardService,()=>canActivate(permissions.admin)] 
 },
  { path: 'transactions/:id', component: TransactionDetailsComponent },
  { path: 'sales', component: SalesComponent},
  { path: 'supplier', component: SupplierComponent },
  { path: 'salesAgent/:id', component: AgentAccountComponent,
    canActivate:[AuthGuardService,()=>canActivate(permissions.admin)] 
 },
  { path: 'prices', component: PriceManagementComponent,
    canActivate:[AuthGuardService,()=>canActivate(permissions.admin)] 
},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {}
