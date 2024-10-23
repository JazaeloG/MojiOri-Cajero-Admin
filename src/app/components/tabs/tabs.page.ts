import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {


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
