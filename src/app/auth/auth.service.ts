import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { API } from '../appConfig';
import {ROLES} from "./Roles"
interface user{
  email: string,
  password:string
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  public currentUser:any=JSON.parse(localStorage.getItem('currentUser'));
  userRoles:any[]=JSON.parse(localStorage.getItem('currentUser'))?.roles;
  private logInmessage=""
  constructor(private http: HttpClient, private router: Router) {

  }


    logIn(data: user){
   return this.http.post<any>(`${API}auth/login`, data) 
  }

  logOut() {
    localStorage.clear();
   // this.router.navigateByUrl('auth/login');
    //location.replace('auth/login')
    location.reload();
  }
  isAuthenticated(): Boolean {
    if (this.currentUser) {
      // this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      return true;
    }
    return false;
  }

  getCurrentUser() {
       return JSON.parse(localStorage.getItem('currentUser'));
  }


assignRoles(userRoles:any){
  return this.http.post<any>(`${API}auth/roles`, userRoles)
}

// ADMIN ROLE
  isAdmin() {
   const admin=ROLES.find(role=>role.name="ADMIN");
   return this.userRoles.includes(admin.code)
  }
  // EDITOR ROLE
  isEditor() {
    const editor=ROLES.find(role=>role.name="EDITOR");
   // console.log("userRoles",this.userRoles)
    return this.userRoles.includes(editor.code)
   }
   // CAMP BOSS
   isCampBoss() {
    const campboss=ROLES.find(role=>role.name="CAMP BOSS");
    return this.userRoles.includes(campboss.code)
   }

// SECRETARY ROLE
   isSecretary() {
    const sec=ROLES.find(role=>role.name="SECRETARY");
     return this.userRoles.includes(sec.code)
   }

   // EMPLOYEE

   isEmployee() {
    const emp=ROLES.find(role=>role.name="EMPLOYEE");
     return this.userRoles.includes(emp.code)
   }

   // SALES AGENT
   isSalesAgent() {
    const agent=ROLES.find(role=>role.name="SALES AGENT");
     return this.userRoles.includes(agent.code)
   }

     // ACCOUNTANT
     isAccountant() {
      const accountant=ROLES.find(role=>role.name="ACCOUNTANT");
       return this.userRoles.includes(accountant.code)
     }
     getLogInMessage(){
      return this.logInmessage
     }

     public hasRole(role:number):boolean{
      return(this.userRoles.includes(role))
     }
}


export const canActivate = (roleCode:number ) =>JSON.parse(localStorage.getItem("currentUser")).roles.includes(roleCode) 