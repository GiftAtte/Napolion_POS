import { AuthService } from './auth/auth.service';
import { Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalServiceService } from './services/modal-service.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements DoCheck,OnInit {
  title = 'Promoor Global';
  showFiller = false
  menuRequired=false

  constructor(private route: Router,
    private modalService: ModalServiceService,
    private authService: AuthService,
    private router:Router
  ) { }
  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
       this.router.navigate(["auth"])
    }
   //this.checkRoute()
}
  ngDoCheck() {
    this.checkRoute();
   // this.route.navigate(['auth']);
  }
  checkRoute() {
    if (!this.route.url.startsWith('/auth')) {
       this.menuRequired = true;
    } else {
     this.menuRequired = false;
    }
   }


}
