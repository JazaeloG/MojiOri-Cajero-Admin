import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {


  ngOnInit() {
  }
  constructor(private platform: Platform) {}

  isDesktop() {
    return this.platform.width() > 768; 
  }
  selectedMenu: string = ''; 

  selectMenu(menu: string) {
    this.selectedMenu = menu; 
  }
}
