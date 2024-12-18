import { Component, OnInit } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  selectedMenu: string = ''; 

  constructor(private platform: Platform, private menuController: MenuController) {}

  ngOnInit() {}

  isDesktop() {
    return this.platform.width() > 768;
  }

  selectMenu(menu: string) {
    this.selectedMenu = menu; 
    this.menuController.close(); 
  }
}
