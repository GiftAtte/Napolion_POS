import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRoute, CanActivate, Router } from '@angular/router';
import { aC } from '@fullcalendar/core/internal-common';


@Injectable()


export class AuthGuardService implements CanActivate{

  constructor(
    private authService: AuthService,
    private navigator:Router,
    private activeRoute:ActivatedRoute
    )
     {

}
  canActivate() {

 
    // this.activeRoute.data.subscribe(data=>console.log(data["roles"])) 
    
    if (this.authService.isAuthenticated()) {
       return true;
    } else {
      this.navigator.navigate(['auth'])
      return false
    }
  //  return true


  }

}