import { RoleComponent } from './auth/role/role.component';
import { DepartmentComponent } from './department/department.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { canActivate } from './auth/auth.service';
import { EmployeeProfileComponent } from './employee/employee-profile/employee-profile.component';
import { UserComponent } from './auth/user/user.component';
import { EmployeeComponent } from './employee/employee.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { permissions } from './auth/Roles';
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'inventory',
    loadChildren: () =>
      import('./inventory/inventory.module').then((m) => m.InventoryModule),
  },
  { path: '', component: DashboardComponent, canActivate: [AuthGuardService] },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    
  },
  { path: 'employees', 
  component: EmployeeComponent,
  canActivate: [AuthGuardService, ()=>canActivate(permissions.admin)],
 },
  { path: 'employees/profile/:id', component: EmployeeProfileComponent },
  { path: 'users', component: UserComponent },
  { path: 'users', component: UserComponent },
  { path: 'appSettings',
   component: SettingsComponent,
   canActivate: [AuthGuardService, 
                 ()=>canActivate(permissions.admin)
                ],
   },
  { path: 'departments', component: DepartmentComponent},
  { path: 'roles',
   component: RoleComponent,
  canActivate: [AuthGuardService, 
                ()=>canActivate(permissions.admin)],
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
   // enableTracing: true,
    useHash:true
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
