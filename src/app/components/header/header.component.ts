import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  currentUser: any
  userPhoto
  constructor(private authService: AuthService) {
    //location.reload();
   }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.userPhoto = `../../../assets/img/profile/${this.currentUser?.photo}`;
  }

  logOut() {
    this.authService.logOut();
  }
}
