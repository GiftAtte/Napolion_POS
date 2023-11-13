import { AuthService } from './../../auth/auth.service';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { Component, OnInit,HostListener } from '@angular/core';
import {
  MENU_ITEMS,
  INVENTORY_ITEMS,
  HR_ITEMS,
  SETTINGS,
  PETTY_CASH,
} from './menuItems';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  showFiller = false;
  opened = true;
  mobile = false;
  panelOpenState = false;
  public getScreenWidth: any;
  public menuItems = MENU_ITEMS;
  public inventoryItems = INVENTORY_ITEMS;
  public hrItems = HR_ITEMS;
  public settingsItems = SETTINGS;
  public pettyItems = PETTY_CASH;


 showLoader=false


  constructor(private router: Router,
    public gate:AuthService
    ) {
   
}



  toggleOpened() {
    this.opened = !this.opened;
  }

  ngOnInit() {
    this.getScreenWidth = window.innerWidth;
    this.checkMobile();
    this.router.events.subscribe((routerEvent: Event) => {
      if (routerEvent instanceof NavigationStart) {
                this.showLoader=true
     }
     if (routerEvent instanceof NavigationEnd) {
                this.showLoader=false
     }

    })
  }

  checkMobile() {
    if (this.getScreenWidth <= 600) {
      // 768px portrait
      this.mobile = true;
      this.opened = false;
    } else {
      this.opened = true;
      this.mobile = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.getScreenWidth = window.innerWidth;
    this.checkMobile();
  }
}
