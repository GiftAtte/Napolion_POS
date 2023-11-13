import { AuthService } from './../auth.service';
import { EmployeeService } from 'src/app/services/employee.service';
import { Component, OnInit } from '@angular/core';
import { ROLES } from '../Roles';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})



export class RoleComponent implements OnInit {

  constructor(private employeeService: EmployeeService,
    private authService: AuthService,
    private toastr:ToastrService
    ) {

}

  roleList = ROLES;
  employee:any[]
  roleIds = [];
  roles = [];
  selectedUser:any
  selectedUserId = "";
  showLoader=false
  ngOnInit(): void{
    this.employeeService.getPEmployees(0, 100).subscribe({
      next: (res) => {
     this.employee=res.data
      },
      error: (err) => {
        alert("There was error: "+err.message)
      }
  })
  }

  onEmployeeChange(data: any) {
    this.roles=[]
  data.value.forEach((element:any) => {
  let el=  this.roleList.find((role) => role.code === element)
    this.roles.push(el)
    console.log(this.roles);
  });
  }


  setSelectedUser(event:any) {
    this.selectedUserId=event.value
  this.selectedUser = this.employee.find(
    (emp: any) => emp.user._id === event.value
  );
}

addRoles(){
  
   const userInfo={
    id:this.selectedUserId,
    roles:this.roles.map(role=>role.code)
   }

   if(this.selectedUserId && this.roles.map(role=>role.code).length){

    this.showLoader=true
this.authService.assignRoles(userInfo).subscribe({
  next:(res)=>{
   this.showLoader=false
   this.toastr.success('Roles Added Successfully', 'Success', {
    timeOut: 3000,
    
  });
  this.roles=[]
  
  }
})
}
}
}
