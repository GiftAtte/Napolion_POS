import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule} from "@angular/forms"

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { MaterialComponents } from 'src/material.module';
import { RoleComponent } from './role/role.component';
import { SharedComponents } from '../components/sharedComponents.module';


@NgModule({
  declarations: [
    LoginComponent,
    UserComponent,
    RegisterComponent,
    RoleComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    MaterialComponents,
    FormsModule,
    ReactiveFormsModule,
    SharedComponents,
  ],
})
export class AuthModule {}
