import { AuthInterceptor } from './auth.interceptor';
import { AuthService } from './auth/auth.service';
import { SharedComponents } from './components/sharedComponents.module';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { FullCalendarModule } from '@fullcalendar/angular';
import { InventoryModule } from './inventory/inventory.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MaterialComponents } from '../material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogComponent } from './dialog/dialog.component';
//import { DatatableComponent } from './components/datatable/datatable.component';
import { EmployeeComponent } from './employee/employee.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { InfoBoxComponent } from './components/info-box/info-box.component';
import { DialogOpenerComponent } from './components/dialog-opener/dialog-opener.component';
import { FullCalendarComponent } from './components/full-calendar/full-calendar.component';
import { ChartComponent } from './components/chart/chart.component';
import { SimpleTableComponent } from './components/simple-table/simple-table.component';
//import { AppModalComponent } from './components/app-modal/app-modal.component';
import { EmployeeFormComponent } from './employee/employee-form/employee-form.component';

import { DepartmentComponent } from './department/department.component';
import { EmployeeService } from './services/employee.service';
import { EmployeeProfileComponent } from './employee/employee-profile/employee-profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SettingsFormComponent } from './settings/settings-form/settings-form.component';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { AuthGuardService } from './auth/auth-guard.service';
import { AppSettingsComponent } from './app-settings/app-settings.component';
import { DepartmentFormComponent } from './department/department-form/department-form.component';
import { OutOfStockComponent } from './dashboard/out-of-stock/out-of-stock.component';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    DialogComponent,
    // DatatableComponent,
    EmployeeComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    UserComponent,
    InfoBoxComponent,
    DialogOpenerComponent,
    FullCalendarComponent,
    ChartComponent,
    SimpleTableComponent,
    //AppModalComponent,
    EmployeeFormComponent,
    DepartmentComponent,
    EmployeeProfileComponent,
    SettingsComponent,
    SettingsFormComponent,
    AppSettingsComponent,
    DepartmentFormComponent,
    OutOfStockComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // MaterialComponents,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FullCalendarModule,
    InventoryModule,
    SharedComponents,
    StoreModule.forRoot({}, {}),
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),

    //AuthModule
  ],
  providers: [
    EmployeeService,
    AuthService,
    AuthGuardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi:true
    },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class AppModule {}
